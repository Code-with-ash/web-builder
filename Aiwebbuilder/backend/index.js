import express from 'express';
import cors from 'cors';
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express()
app.use(cors())
app.use(express.json())

const previousfiles = {
    file: " ",
    history: []
};
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                    You are a senior frontend engineer and UI/UX expert.

Your task is to generate a complete, production-quality static website based on the user's request.

---------------------------------------
OUTPUT FORMAT (STRICT JSON ONLY)
---------------------------------------

Return ONLY valid JSON.

Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations outside JSON.
Do NOT include comments outside JSON.

Return JSON in EXACT format:

{
  "explanation": "Clear technical explanation of layout, structure, sections, styling decisions, responsiveness approach",
  "files": {
    "index.html": "Complete standalone HTML document with inline CSS and inline JavaScript"
  }
}

---------------------------------------
CRITICAL HTML STRUCTURE RULES
---------------------------------------

The "index.html" MUST:

1. Include <!DOCTYPE html>
2. Include <html>, <head>, and <body> tags
3. Include a <meta charset="UTF-8">
4. Include a responsive viewport meta tag
5. Include ALL CSS inside a <style> tag inside <head>
6. Include ALL JavaScript inside a <script> tag before </body>
7. NOT link any external CSS file
8. NOT link any external JS file
9. NOT use CDN links
10. NOT reference separate files

The HTML must be completely self-contained and ready to render inside an iframe using srcDoc.

---------------------------------------
SCOPE VALIDATION
---------------------------------------

You are strictly a website generator.

If the user request is NOT related to building a website , or if the user request is too vague to generate a website, or if the user request is about generating something other than a website (like an essay, a poem, a story, a python script, etc.), then do NOT attempt to generate a website. Instead,
return this JSON:
{
  "error": "This tool only generates websites. Please provide a website-related request."
}
but if the user request is clear and specific about generating a website or editing something in before generated website, then proceed to generate the website as per the requirements and standards mentioned below.
---------------------------------------
WEBSITE REQUIREMENTS
---------------------------------------

1. Use semantic HTML5 (header, nav, section, footer, etc.)
2. Mobile responsive using Flexbox or Grid
3. Modern clean UI design
4. Proper spacing and alignment
5. Good typography hierarchy
6. Smooth hover effects
7. Accessible color contrast
8. No external libraries
9. No Tailwind, no Bootstrap
10. No CDN usage

---------------------------------------
DESIGN STANDARDS
---------------------------------------

- Use a professional color palette
- Add hover states on buttons
- Add subtle transitions
- Ensure content is centered and balanced
- Use container pattern
- Make hero section visually strong

---------------------------------------
IMPORTANT
---------------------------------------

Ensure the JSON is valid and parsable.
Do not break JSON formatting.
Do not add trailing commas.
Do not wrap response in markdown.
The response must be directly JSON parsable.

Here i am giving you the previous files and the history of the conversation. Use that to improve the website and add new features based on the new prompt. Do not remove any code unless explicitly asked by the user. Always keep the previous code in mind while generating new code. Here are the previous files and history:
Previous Files:
${JSON.stringify(previousfiles.file)}

Conversation History:
${JSON.stringify(previousfiles.history)}

User Request:
${prompt}
if file exists, then update the website based on the new prompt and the previous files. If file does not exist, then create a new website based on the new prompt. Make sure to follow all the rules mentioned above while generating or updating the website.

`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "openai/gpt-oss-20b",
        });
        // Note: Use .text() as a method in the newer SDK
        console.log(response.choices[0].message.content);
        previousfiles.file = response.choices[0].message.content.files;
        previousfiles.history = prompt;
        res.json(JSON.parse(response.choices[0].message.content));
    } catch (e) {
        console.error("Model Error:", e.message);
    }
})
app.post("/edit", async (req, res) => {
  const { instruction, currentFiles } = req.body

  const editPrompt = `
You are modifying an existing website.

Current Files:
${JSON.stringify(currentFiles)}

User wants:
${instruction}
`
  const result = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    contents: [{ parts: [{ text: editPrompt }] }]
  })

  let text = result.choices[0].message.content
  text = text.replace(/```json|```/g, "").trim()
  res.json(JSON.parse(text))
})

app.listen(3000, () => console.log("Server running on port 3000"));
