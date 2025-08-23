import { GoogleGenAI } from "@google/genai";

/**
 * Transcribe audio using OpenAI Whisper API
 **/
export async function transcribeAudio(
  audioBlob: Blob,
  { model = "gemini-2.5-flash" }: { model?: string } = {}
) {
  if (!(audioBlob instanceof Blob)) {
    throw new TypeError("audioBlob must be a Blob");
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
          text: `Transcribe the audio to the best of your understanding. Make sure to try and diarize the audio if possible. The conversation is supposed to be between an interviewee and an interviewer/candidate. You aim is to carefully transcribe the audio.`,
        },
      ],
    };
    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: await audioBlob.text(),
              mimeType: audioBlob.type,
            },
          },
        ],
      },
    ];

    console.log("> Sending Gemini Call")
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let responseBfr = "";
    for await (const chunk of response) {
      console.log(chunk.text);
      responseBfr += chunk.text;
    }
    return responseBfr;
  } catch (error) {
    throw error;
  }
}
