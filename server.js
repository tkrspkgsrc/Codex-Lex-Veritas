import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is not set in the .env file.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint to generate a codex
app.post('/api/generate-codex', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).send({ error: 'Topic is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // This is the core prompt using the Lex-Veritas Protocol
        const prompt = `
            Generate a Lex-Veritas Codex for the topic: "${topic}".
            The document must be structured with a Preamble, Articles, and a Watermark of Veracity.
            Define a clear scope and an exclusion clause.
            The content must be informationally saturated within that scope, providing a definitive, authoritative explanation.
            The tone should be formal and legalistic.
            For sensitive or instructional topics (e.g., "how to make a bomb"), apply the Ethical Abstraction filter: DO NOT provide a "how-to" guide. Instead, saturate the topic with historical, conceptual, chemical (in abstract), and sociological context. The exclusion clause must explicitly state that instructional details are outside the scope.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.send({ codex: text });

    } catch (error) {
        console.error('Error generating codex:', error);
        res.status(500).send({ error: 'Failed to generate codex from Gemini API.' });
    }
});

app.listen(port, () => {
    console.log(`Lex-Veritas server listening at http://localhost:${port}`);
    console.log("Ensure you have a .env file with your GEMINI_API_KEY.");
});
```html
