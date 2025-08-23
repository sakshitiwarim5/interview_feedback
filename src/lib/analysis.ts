import { GoogleGenAI } from "@google/genai";

/**
 * Transcribe audio using OpenAI Whisper API
 **/
export async function getAnalysisFromTranscript(
  transcript: string,
  { model = "gemini-2.5-pro" }: { model?: string } = {}
) {
  if (!transcript) {
    throw new TypeError("transcript must not be empty");
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
    const tools = [
      {
        googleSearch: {},
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
      systemInstruction: [
        {
          text: `Analyze the given conversation transcript between a recruiter and a candidate/interviewee. You aim is to provide the following analyses for both the recruiter and the candidate. Fill out the given JSON structure and ensure that your response is only the provided JSON and nothing else. Do not add any commentary, prefix or suffix to your response structure.

Output JSON:
\`\`\`json
{
  "recruiter": {
    "areas_missed": "<the areas that the recruiter missed during the conversation; Second Person Perspective>",
    "potential_missed_questions": "<potential missed questions by the recruiter that might have helped in the interview; Second Person Perspective>"
  },
  attendee: {
    "what_went_well": "<what went well for the candidate in the interview; Second Person Perspective>",
    "what_to_improve": "<what the candidate could improve upon based on this conversation; Second Person Perspective>",
    "actionable_tip": "<one actionable tip for the candidate that they can work on immediately; Second Person Perspective>"
  }
}
\`\`\``,
        },
      ],
    };
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: transcript,
          },
        ],
      },
    ];

    console.log("> Sending Gemini Call");
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    return response.text;
  } catch (error) {
    throw error;
  }
}

export function parseAnalysisJSON(analysis_text: string) {
  try {
    const analysis_prepared = analysis_text
      .replaceAll("```json", "")
      .replaceAll("```", "")
      .trim();
    return JSON.parse(analysis_prepared);
  } catch (err) {
    console.error(err);
    return null;
  }
}
