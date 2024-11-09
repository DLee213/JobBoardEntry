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
    const response = await axios.get(apiUrl, {
      responseType: 'stream'
    });
    const parser = sax.createStream(true);

    let currentTag = null;
    let jobData = {};

    parser.on("opentag", (node) => {
      currentTag = node.name;
      if(currentTag === "job") 
        jobData = {};
    })

    parser.on("cdata", (text) => {
      if(currentTag === "company"){
        jobData.company = text
        console.log(jobData)
        jobData = {}
      }
    })
    
    response.data.pipe(parser);

  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});