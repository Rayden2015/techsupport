require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAIApi } = require('openai');

const app = express();

// Parse JSON request bodies
app.use(bodyParser.json());

// Set OpenAI API key from .env file
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error('OpenAI API key is missing. Please set OPENAI_API_KEY in .env file.');
  process.exit(1);
}

// Set up OpenAI API instance
const openaiInstance = new OpenAIApi(process.env.OPENAI_API_KEY);

// Define API endpoint for question generation
app.post('/fidelity/ask', async (req, res) => {
  try {
    // Extract question from request body
    const { question } = req.body;

    // Set up the prompt with context and question
    const context = "This is the context provided in the source code.";
    const prompt = `Context: ${context}\nQuestion: ${question}\nAnswer:`;

    // Use OpenAI API to generate text
    const response = await openaiInstance.createCompletion({
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: ['\n']
    });

    // Extract the generated answer from the API response
    const answer = response.choices[0].text.trim();

    // Return the generated answer as the API response
    res.json({ answer });
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

// Start the Express.js server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

