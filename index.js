import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import env from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const app = express();
const port = process.env.PORT || 3080;

env.config();

app.use(cors());
app.use(bodyParser.json());

// Configure OpenAI API
const configuration = new Configuration({
  organization: "org-Mt0wv7Q6kbJrEjyCPik97kgb",
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", async (req, res, next) => {
  try {
    const { message, image } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      max_tokens: 100,
      temperature: 0.5,
      image,
    });
    const { text } = response.data.choices[0];
    res.json({ message: text });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
