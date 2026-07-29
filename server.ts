/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI to prevent crash on startup if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiConfigured: !!process.env.GEMINI_API_KEY });
});

// Dynamic Question Generator API via Gemini
app.post("/api/generate-question", async (req, res) => {
  const { conceptId, clauseNum, originalText, innerLandscape, mode } = req.body;

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are an expert Professor of Traditional Chinese Medicine (TCM) specializing in the "Inner Landscape Explanation of Shanghan Lun" (内景解伤寒) compiled by 愤怒的小中医.
Your goal is to generate an interactive, high-quality, clinical/theoretical multiple-choice question to test the user's understanding of a specific Shanghan clause and its physical/fluid-dynamical inner landscape (内景).

CRITICAL RULE:
- Do NOT make the question identical to generic textbook questions.
- Provide a realistic modern clinical case (patient age, profession, main complaints, exact pulse, and tongue picture) which perfectly matches the inner landscape of the clause, OR a high-fidelity theoretical scenario.
- All response text MUST be in Chinese.
- You must return ONLY a JSON object that strictly adheres to the requested schema. Do not wrap it in markdown codeblocks.`;

    const userPrompt = `Generate a unique multiple-choice question for:
Clause Reference: ${clauseNum || "General Concept"}
Original Text: ${originalText || "N/A"}
Inner Landscape: ${innerLandscape}
Mode: ${mode || "practice"} (Generate a realistic patient clinical case with symptoms, pulse, and tongue that perfectly correspond to this inner landscape, requiring the user to identify the correct pathologic mechanism, appropriate TCM formula, or core herb action based on fluid-dynamics).

You must return a JSON object with this exact structure:
{
  "question": "A detailed question text describing a clinical case or a core mechanism question.",
  "options": [
    "Option A (correct or incorrect)",
    "Option B",
    "Option C",
    "Option D"
  ],
  "answer": "The exact string of the correct option",
  "explanation": "A deeply educational, cellular/pore-level (玄府/气分/血分) Inner Landscape explanation explaining why the answer is correct and why other options are wrong."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "Question description containing clinical pulse and tongue" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 options"
            },
            answer: { type: Type.STRING, description: "The exact matching string of the correct option" },
            explanation: { type: Type.STRING, description: "The detailed physical/landscape feedback in Chinese" }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });

    const contentText = response.text || "";
    const parsed = JSON.parse(contentText.trim());
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Question Generation Error:", err.message);
    // Graceful fallback to prevent client crash - return a randomized local-style case
    res.status(500).json({
      error: "Gemini API failed or is not configured.",
      message: err.message
    });
  }
});

// AI Inner Landscape Symptom Diagnosis Clinic
app.post("/api/clinic/diagnose", async (req, res) => {
  const { symptoms, pulse, tongue } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Please enter patient symptoms." });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are the master virtual doctor of the "Inner Landscape Shanghan Lun Clinic" (内景伤寒中医学堂).
Analyze the user's symptoms, pulse, and tongue through the rigorous physical lens of:
1. 玄府 (Pores/membrane gates open or closed?)
2. 气分 (Extracellular fluids - water accumulation, water stagnation, or dehydration?)
3. 血分 (Intracellular and vascular blood - cold/congested, hot/over-vaporized, or depleted?)
4. 精路 (Meridians and energy conduits - blocked by 'Little Pig covered by blanket' or lack of Kidney fire?)

Explain the pathogenesis clearly in Chinese with a friendly, educational, scientific tone, matching relevant Shanghan Lun clauses (1 to 397) and suggesting classical formulas (e.g. 桂枝汤, 麻黄汤, 小柴胡汤, 五苓散, 真武汤, 乌梅丸 etc.) along with physical explanations of how each ingredient acts on the cell/vessel membranes.`;

    const userPrompt = `Patient Record:
- Symptoms/Complaints: ${symptoms}
- Pulse (脉象): ${pulse || "未提及"}
- Tongue (舌象): ${tongue || "未提及"}

Analyze the case. You must return a strict JSON response with the following keys (do not include extra text outside the JSON):
{
  "blockedXuanfu": "Explanation of whether Xuanfu is closed or open, and where.",
  "fluidStagnation": "Status of Qi-water and blood-fluids (e.g., '小猪盖被' or '乌鸦喝水' or '初硬后溏' etc.).",
  "matchedClauses": "Which Shanghan clauses relate to this condition? Cite clause text.",
  "recommendedFormula": "Classic Shanghan formula name and exact traditional composition.",
  "herbActions": [
    { "herb": "Herb A", "landscapeAction": "How this herb physically opens Xuanfu, dilutes water, or moves venous blood in the inner landscape." }
  ],
  "dietLifestyleAdvice": "Friendly warnings about cold drinks, thermal exposure, etc. based on inner landscape principles."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blockedXuanfu: { type: Type.STRING },
            fluidStagnation: { type: Type.STRING },
            matchedClauses: { type: Type.STRING },
            recommendedFormula: { type: Type.STRING },
            herbActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  herb: { type: Type.STRING },
                  landscapeAction: { type: Type.STRING }
                },
                required: ["herb", "landscapeAction"]
              }
            },
            dietLifestyleAdvice: { type: Type.STRING }
          },
          required: ["blockedXuanfu", "fluidStagnation", "matchedClauses", "recommendedFormula", "herbActions", "dietLifestyleAdvice"]
        }
      }
    });

    const contentText = response.text || "";
    const parsed = JSON.parse(contentText.trim());
    res.json(parsed);
  } catch (err: any) {
    console.error("TCM Clinic Gemini Error:", err.message);
    res.status(500).json({
      error: "AI Clinic Diagnostic Engine is currently unavailable offline.",
      message: err.message
    });
  }
});

// Vite server setup or production bundle serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[V8 INJS REGEXP CLINIC] Server running on http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
