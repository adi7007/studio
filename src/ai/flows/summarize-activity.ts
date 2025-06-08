// Summarize the user's previous activity to help them resume their tasks efficiently.
'use server';

/**
 * @fileOverview Summarizes the user's recent activity to facilitate task resumption.
 *
 * - summarizeActivity - A function that takes a log of user activities and returns a summarized context.
 * - SummarizeActivityInput - The input type for the summarizeActivity function.
 * - SummarizeActivityOutput - The return type for the summarizeActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeActivityInputSchema = z.object({
  activityLog: z
    .string()
    .describe(
      'A log of user activities, with timestamps, including application usage, file access, and system events.'
    ),
});
export type SummarizeActivityInput = z.infer<typeof SummarizeActivityInputSchema>;

const SummarizeActivityOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the user’s previous activity.'),
});
export type SummarizeActivityOutput = z.infer<typeof SummarizeActivityOutputSchema>;

export async function summarizeActivity(input: SummarizeActivityInput): Promise<SummarizeActivityOutput> {
  return summarizeActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeActivityPrompt',
  input: {schema: SummarizeActivityInputSchema},
  output: {schema: SummarizeActivityOutputSchema},
  prompt: `You are an AI assistant designed to summarize user activity logs.

  Please provide a concise summary of the following activity log to help the user quickly remember where they left off:

  Activity Log:
  {{activityLog}}
  `,
});

const summarizeActivityFlow = ai.defineFlow(
  {
    name: 'summarizeActivityFlow',
    inputSchema: SummarizeActivityInputSchema,
    outputSchema: SummarizeActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
