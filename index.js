const express = require("express");
const cors=require("cors")
require("dotenv").config();

const app = express();

app.use(cors())
app.use(express.json());

app.post("/get-info", async (req, res) => {
  const {text,category}=req.body
  try {
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;

    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        method: "POST",
        body: JSON.stringify({
          prompt: `Generate a ${category} about the word ${text}. It should be of 4-5 lines`,
          max_tokens: 2048,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.api_key}`,
        },
      }
    );

    const responseBody = await response.json();
    console.log(responseBody);
    const info = responseBody.choices[0].text.trim();
    res.status(200).json({info:info})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(process.env.PORT, () => {
  try {
    console.log("connected to the server");
    console.log(`server is running at port:-${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});
