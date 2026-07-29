/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WrongQuestionItem {
  id: string;
  topicTitle: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  userAnswer?: string;
  timestamp: number;
}

const STORAGE_KEY = 'sh_wrong_questions';

export function getWrongQuestions(): WrongQuestionItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load wrong questions', e);
  }
  return [];
}

export function saveWrongQuestion(item: Omit<WrongQuestionItem, 'timestamp'>) {
  const current = getWrongQuestions();
  // Avoid duplicate question entry
  const exists = current.some(q => q.question === item.question);
  if (!exists) {
    const updated = [{ ...item, timestamp: Date.now() }, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}

export function removeWrongQuestion(id: string) {
  const current = getWrongQuestions();
  const updated = current.filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearWrongQuestions() {
  localStorage.removeItem(STORAGE_KEY);
}
