import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.NUMBER, description: "Score out of 5 based on Cambridge PET criteria" },
        communicativeAchievement: { type: Type.NUMBER, description: "Score out of 5 based on Cambridge PET criteria" },
        organization: { type: Type.NUMBER, description: "Score out of 5 based on Cambridge PET criteria" },
        language: { type: Type.NUMBER, description: "Score out of 5 based on Cambridge PET criteria" },
      },
      required: ["content", "communicativeAchievement", "organization", "language"],
    },
    totalScore: { type: Type.NUMBER, description: "Sum of the 4 sub-scores (max 20)" },
    generalFeedback: { type: Type.STRING, description: "A brief summary of the examiner's thoughts." },
    goodPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of strengths in the writing.",
    },
    badPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of weaknesses or errors.",
    },
    revisedText: { type: Type.STRING, description: "The full story rewritten to be perfect B1/B2 level English." },
    inlineFeedback: {
      type: Type.ARRAY,
      description: "The complete original story split into segments. Concatenating the 'text' fields must reconstruct the exact original story, including whitespace and newlines.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The segment of original text. Keep original whitespace/newlines." },
          isError: { type: Type.BOOLEAN, description: "True if this segment contains an error." },
          correction: { type: Type.STRING, description: "The corrected text for this segment (if error)." },
          explanation: { type: Type.STRING, description: "Brief explanation of the error (if error)." },
          type: { type: Type.STRING, enum: ["grammar", "vocabulary", "spelling", "punctuation", "style"], nullable: true },
        },
        required: ["text", "isError"],
      },
    },
  },
  required: ["scores", "totalScore", "generalFeedback", "goodPoints", "badPoints", "revisedText", "inlineFeedback"],
};

export const analyzeStory = async (story: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Act as a Cambridge English B1 Preliminary (PET) Examiner. 
      Analyze the following student story written for the prompt: "Your story must begin with this sentence: When Pat opened the book, an old letter fell out of it."
      
      The student's story is:
      """
      ${story}
      """

      Evaluate it strictly according to the Cambridge B1 Writing Part 2 criteria:
      1. Content: Is the story relevant? Is the target reader informed?
      2. Communicative Achievement: Is the style appropriate for a story?
      3. Organization: formatting, paragraphing, linking words.
      4. Language: Grammar, vocabulary range and accuracy.

      Provide a JSON response.
      
      IMPORTANT for 'inlineFeedback': 
      Break the ENTIRE student story into a list of sequential text segments.
      - Every character from the original story (including spaces and newlines) must be preserved in the 'text' fields.
      - When you find an error (grammar, spelling, awkward phrasing), mark that specific segment with isError: true, and provide the correction and explanation.
      - Segments without errors should have isError: false.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for precise segmentation
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing story:", error);
    throw error;
  }
};