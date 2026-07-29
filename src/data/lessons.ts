/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Topic } from '../types';
import { CHAPTERS, LEVEL_GATES } from './chapters';
import { TOPICS_CH1_CH2 } from './topics_ch1_ch2';
import { TOPICS_CH3_CH4 } from './topics_ch3_ch4';
import { TOPICS_CH5_CH6 } from './topics_ch5_ch6';
import { TOPICS_CH7_CH8 } from './topics_ch7_ch8';
import { TOPICS_LIUJING_DEEP } from './topics_liujing_deep';
import { CLINICAL_CASES_20, CASE_UI_CONFIG } from './clinical_cases';

export { CHAPTERS, LEVEL_GATES, CLINICAL_CASES_20, CASE_UI_CONFIG };

// Map the 20 clinical cases into corresponding TOPICS so each topic contains structured clinical cases
const rawTopics: Record<string, Topic> = {
  ...TOPICS_CH1_CH2,
  ...TOPICS_CH3_CH4,
  ...TOPICS_CH5_CH6,
  ...TOPICS_CH7_CH8,
  ...TOPICS_LIUJING_DEEP
};

// Enrich topics with clinicalCases
const topicKeys = Object.keys(rawTopics);
topicKeys.forEach((key, idx) => {
  const topic = rawTopics[key];
  // Assign 1-2 cases per topic sequentially
  const case1 = CLINICAL_CASES_20[idx % CLINICAL_CASES_20.length];
  const case2 = CLINICAL_CASES_20[(idx + 10) % CLINICAL_CASES_20.length];
  topic.clinicalCases = [case1, case2];
  
  if (topic.lessons && topic.lessons.length > 0) {
    topic.lessons.forEach((lesson, lIdx) => {
      lesson.clinicalCases = [CLINICAL_CASES_20[(idx + lIdx) % CLINICAL_CASES_20.length]];
    });
  }
});

export const TOPICS: Record<string, Topic> = rawTopics;
