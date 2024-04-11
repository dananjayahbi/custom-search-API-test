const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/search", async (req, res) => {
  const { query } = req.body;
  try {
    const duckDuckGoResponse = await axios.get(
      `https://api.duckduckgo.com/?q=${query}&format=json`
    );
    const relatedTopics = duckDuckGoResponse.data.RelatedTopics.slice(0, 3);
    const urls = relatedTopics.map((topic) => {
      const $ = cheerio.load(topic.Text);
      return $("a").attr("href");
    });
    res.json({ urls });
  } catch (error) {
    console.error("Error searching DuckDuckGo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//test route
app.get("/test", async (req, res) => {
  try {
    const query = "cat";
    const duckDuckGoResponse = await axios.get(
      `https://api.duckduckgo.com/?q=${query}&format=json`
    );

    const relatedTopics = duckDuckGoResponse.data.RelatedTopics.slice(0, 3);

    const urls = relatedTopics.map((topic) => topic.FirstURL);

    //send the responce as JOSN
    // res.json(duckDuckGoResponse.data);
    // res.json(relatedTopics);
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//test route 2
app.get("/test2", async (req, res) => {
  async function searchDuckDuckGo(query) {
    try {
      const response = await axios.get("https://api.duckduckgo.com", {
        params: {
          q: query,
          format: "json",
          no_html: "1",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return null;
    }
  }

  try {
    const query = "postman";
    searchDuckDuckGo(query)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.error("Error searching DuckDuckGo:", error);
        res.status(500).json({ error: "Internal server error" });
      });

    //send the responce as JOSN
    // res.json(relatedTopics);
    // res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//test route 3
app.get("/test3", async (req, res) => {
  try {
    const query = "cat";
    const duckDuckGoResponse = await axios.get(
      `https://api.duckduckgo.com/?q=${query}&format=json`
    );

    const relatedTopics = duckDuckGoResponse.data.RelatedTopics.slice(0, 3);
    const firstUrl = relatedTopics[0].FirstURL;

    // Fetch HTML content of the first URL
    const htmlResponse = await axios.get(firstUrl);
    const htmlContent = htmlResponse.data;

    // Parse HTML content using cheerio
    const $ = cheerio.load(htmlContent);

    // Extract text content
    const plainTextContent = $("body").text();

    // Send plain text content as response
    res.send(plainTextContent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//test route 4
app.get("/test4", async (req, res) => {
  try {
    const query = "cat";
    const duckDuckGoResponse = await axios.get(
      `https://api.duckduckgo.com/?q=${query}&format=json`
    );

    const relatedTopics = duckDuckGoResponse.data.RelatedTopics.slice(0, 3);
    const firstUrl = relatedTopics[0].FirstURL;

    // Fetch HTML content of the first URL
    const htmlResponse = await axios.get(firstUrl);
    const htmlContent = htmlResponse.data;

    // Save HTML content to a file in the project directory
    const fileName = 'search_result.html';
    const filePath = path.join(__dirname, fileName);
    await fs.writeFile(filePath, htmlContent);

    res.json({ directUrl: firstUrl });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
