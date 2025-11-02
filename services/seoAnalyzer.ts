
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport } from '../types';

const reportItemSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    status: { type: Type.STRING, enum: ['pass', 'warn', 'fail'] },
    value: { type: Type.STRING },
    description: { type: Type.STRING, description: "A concise summary of the finding, e.g., 'Found (55 chars)'." },
    guidance: { type: Type.STRING, description: "A helpful tip for improvement." },
  },
  required: ['id', 'name', 'status', 'value', 'description', 'guidance']
};

const reportCategorySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    score: { type: Type.INTEGER, description: "An SEO score for the category from 0 to 100." },
    items: {
      type: Type.ARRAY,
      items: reportItemSchema
    }
  },
  required: ['title', 'score', 'items']
};

const analysisReportSchema = {
  type: Type.OBJECT,
  properties: {
    meta: { ...reportCategorySchema, description: "Analysis of meta tags like title, description, canonical, etc." },
    content: { ...reportCategorySchema, description: "Analysis of page content like word count and language." },
    structure: { ...reportCategorySchema, description: "Analysis of page structure like headings and social media tags." },
    links: { ...reportCategorySchema, description: "Analysis of internal/external links and image alt attributes." },
    mobile: { ...reportCategorySchema, description: "Analysis of mobile-friendliness factors like the viewport tag." },
    technical: { ...reportCategorySchema, description: "Analysis of technical SEO factors like HTTPS, robots.txt, and sitemap." }
  },
  required: ['meta', 'content', 'structure', 'links', 'mobile', 'technical']
};

const getAnalysisPrompt = (url: string) => `
You are an expert SEO analysis tool. Your task is to analyze the provided URL and return a detailed SEO report in a specific JSON format.
Do not include any explanatory text, just the JSON object. The URL to analyze is: ${url}

Perform the following checks and score each category from 0 to 100 based on SEO best practices.

Guidelines for checks:
- Title Tag: Check presence. Ideal length: 50-60 characters.
- Meta Description: Check presence. Ideal length: 120-160 characters.
- Meta Keywords: Check presence. Note that it's mostly obsolete.
- Canonical URL: Check for rel="canonical".
- Favicon: Check for rel="icon" or similar.
- Word Count: Count words in the main content area. Warn if < 300 words.
- Language Attribute: Check for 'lang' attribute on <html>.
- Heading Structure: Check for a single H1 and logical order of H2s, H3s.
- Open Graph & Twitter Tags: Check for key tags like og:title, og:description, twitter:card.
- Internal vs External Links: Count both types of links.
- Image Alt Attributes: Check all <img> tags and calculate the percentage with non-empty alt text.
- Viewport Meta Tag: Check for a valid viewport meta tag for mobile responsiveness.
- HTTPS Check: Verify the URL uses HTTPS.
- Robots.txt: Check if [domain]/robots.txt is accessible and valid.
- Sitemap.xml: Check if [domain]/sitemap.xml is accessible.

For each item, 'status' must be one of 'pass', 'warn', or 'fail'.
`;

export const analyzeUrl = async (url: string): Promise<AnalysisReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: getAnalysisPrompt(url),
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisReportSchema,
        temperature: 0.2
      },
    });
    
    const jsonText = response.text.trim();
    const report = JSON.parse(jsonText);
    return report as AnalysisReport;
  } catch (error) {
    console.error("Error analyzing URL with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get SEO analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred during SEO analysis.");
  }
};
