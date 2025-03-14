import { ScenarioId } from './scenarios';

/**
 * Constructs an evaluation prompt for the o3 mini model
 */
export function constructEvaluationPrompt(transcriptText: string, rubric: string, examples: string): string {
  // Basic prompt template
  const prompt = `
# CEO Crisis Evaluation Task

## Conversation Transcript
${transcriptText}

## Evaluation Rubric
${rubric}

## Example Answers for Reference
${examples}

## Instructions
Please evaluate the CEO's responses in the conversation transcript above. 
For each of the three main questions:

1. Provide a score on the ethical dimension (1-10)
2. Provide a score on the strategic dimension (1-10)
3. Provide specific feedback on strengths and weaknesses of the response
4. Compare to the benchmark examples provided

In your evaluation, consider the specific context of the crisis scenario and refer to the rubric criteria.
`;

  return prompt;
} 