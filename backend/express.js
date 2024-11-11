require('dotenv').config();
const axios = require('axios');
const express = require('express');
const sax = require('sax');
const cors = require('cors');

const app = express();
const port = 3000;
const apiUrl = process.env.VITE_API_KEY;
const allowedOrigin = process.env.LOCALHOST_URL;

app.use(cors({
  origin: allowedOrigin
}));

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(apiUrl, { responseType: 'stream' });
    const parser = sax.createStream(true);

    let currentTag = null;
    let jobData = {};

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    parser.on("opentag", (node) => {
      currentTag = node.name;
      if (currentTag === "job") jobData = {};
    });

    parser.on("cdata", (text) => {
      if (currentTag === "company") {
        jobData.company = text;
      }
    });

    parser.on("closetag", (name) => {
      if (name === "job") {
        res.write(`data: ${JSON.stringify(jobData)}\n\n`); // SSE format
        jobData = {};
      }
    });

    parser.on("end", () => {
      res.end();
    });

    response.data.pipe(parser);

  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
