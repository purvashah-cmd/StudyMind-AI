const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
require('dotenv').config();

async function test() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY,
  });
  
  try {
    const res = await embeddings.embedQuery("Hello world");
    console.log("Success! Length:", res.length);
  } catch (e) {
    console.error(e);
  }
}
test();
