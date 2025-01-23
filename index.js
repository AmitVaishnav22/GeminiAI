require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(bodyParser.json());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).send("Hello World! The API is up and running.");
});


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error.message);
        throw new Error("Failed to generate content. Please try again.");
    }
};

app.post("/api", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const result = await generateContent(prompt);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
