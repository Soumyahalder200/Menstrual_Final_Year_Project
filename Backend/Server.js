import express from "express";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new InferenceClient(process.env.HF_TOKEN);

app.post("/generate", async (req, res) => {
    console.log("Received request with body:", req.body); // Debugging log
  try {
    const { prompt } = req.body;

    const chatCompletion = await client.chatCompletion({

      model: "deepseek-ai/DeepSeek-V4-Flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    });
    //console.log("Generated response:", chatCompletion); // Debugging log
    console.log(chatCompletion.choices[0].message.content);
    res.json(chatCompletion.choices[0].message.content);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something exploded internally"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});