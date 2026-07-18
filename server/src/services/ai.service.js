const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { MongoDBAtlasVectorSearch } = require('@langchain/mongodb');
const { MongoClient } = require('mongodb');

// Initialize Gemini LLM and Embeddings
// It will automatically use process.env.GOOGLE_API_KEY if not specified, 
// but we named it GEMINI_API_KEY in our .env. Let's explicitly pass it.
const getLLM = (modelName = 'gemini-2.5-flash') => {
  return new ChatGoogleGenerativeAI({
    model: modelName,
    maxOutputTokens: 8192,
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    modelName: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

const { Document } = require('@langchain/core/documents');
const fs = require('fs');

// Process Document (Load -> Chunk -> Embed -> Store)
const processDocument = async (filePath, fileType, documentId) => {
  try {
    let docs = [];
    if (fileType === 'pdf') {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
    } else if (fileType === 'txt' || fileType === 'md') {
      const text = fs.readFileSync(filePath, 'utf8');
      docs = [new Document({ pageContent: text, metadata: { source: filePath } })];
    } else {
      throw new Error('Unsupported file type');
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    // Add metadata
    const docsWithMetadata = splitDocs.map(doc => {
      doc.metadata = { ...doc.metadata, documentId: documentId.toString() };
      return doc;
    });

    // We need a MongoClient instance for Atlas Vector Search
    // Note: Local MongoDB does not support Atlas Vector Search natively in the same way.
    // For local development without Atlas, we could use a MemoryVectorStore or local Chroma.
    // Since the prompt explicitly said: "JavaScript-compatible vector database" and "MongoDB Atlas",
    // We will assume the MONGO_URI provided in production will be an Atlas URI.
    // For now, we will just simulate success if it's local, or use a basic memory store as fallback if Atlas fails.
    
    // WARNING: In a real scenario, you must have an Atlas cluster and index created for this to work.
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    
    const db = client.db('studymind');
    const collection = db.collection('vectors');

    // Storing vectors
    await MongoDBAtlasVectorSearch.fromDocuments(
      docsWithMetadata,
      getEmbeddings(),
      {
        collection,
        indexName: 'default', // MUST match the index name created in Atlas
        textKey: 'text',
        embeddingKey: 'embedding',
      }
    );
    
    await client.close();

    return true;
  } catch (error) {
    console.error('Error processing document in AI service:', error);
    throw error;
  }
};

const getDocumentContext = async (documentId) => {
    // Basic retrieval for non-RAG generation (grabbing first few chunks for context)
    // For large documents, we'd want a MapReduce approach or more advanced retrieval,
    // but for this MVP we'll fetch the top K chunks blindly or rely on RAG chat.
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('studymind');
    const collection = db.collection('vectors');

    // Just pull all chunks for this doc (increased to 5000 to handle 100+ page PDFs)
    const chunks = await collection.find({ "documentId": documentId.toString() }).limit(5000).toArray();
    await client.close();

    return chunks.map(c => c.text).join('\n\n---\n\n');
};

const generateSummary = async (documentId, type = 'medium') => {
    const context = await getDocumentContext(documentId);
    const llm = getLLM('gemini-2.5-flash');
    
    let lengthInstruction = 'a medium-length summary';
    if (type === 'short') lengthInstruction = 'a very concise, short summary';
    if (type === 'detailed') lengthInstruction = 'a highly detailed, comprehensive summary';

    const prompt = PromptTemplate.fromTemplate(`
      You are an expert study assistant. 
      Read the following document text and provide {lengthInstruction}.
      
      Document Text:
      {context}
      
      Summary:
    `);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return await chain.invoke({ lengthInstruction, context });
};

const generateNotes = async (documentId) => {
    const context = await getDocumentContext(documentId);
    const llm = getLLM('gemini-2.5-flash');
    
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert study assistant. 
      Extract the most important information from the text below and format it into structured smart notes.
      Use markdown headings, subheadings, bullet points, and highlight definitions and key takeaways.
      
      Document Text:
      {context}
      
      Smart Notes:
    `);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return await chain.invoke({ context });
};

const generateQuiz = async (documentId, difficulty = 'Medium') => {
    const context = await getDocumentContext(documentId);
    const llm = getLLM('gemini-2.5-flash');
    
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert study assistant. 
      Create a {difficulty} difficulty multiple-choice quiz based on the text below.
      Output the quiz in strictly valid JSON format exactly like this array of objects:
      [
        {{
          "question": "What is...?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Because..."
        }}
      ]
      
      Document Text:
      {context}
      
      JSON Quiz:
    `);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ difficulty, context });
    
    // Attempt to parse JSON from the markdown block
    try {
       const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/\[\s*\{[\s\S]*\}\s*\]/);
       if (jsonMatch) {
         return JSON.parse(jsonMatch[1] || jsonMatch[0]);
       }
       return JSON.parse(result);
    } catch (e) {
       console.error("Failed to parse Quiz JSON", e, result);
       throw new Error("Failed to generate valid quiz format");
    }
};

const generateMindMap = async (documentId) => {
    const context = await getDocumentContext(documentId);
    const llm = getLLM('gemini-2.5-flash');
    
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert study assistant. 
      Create a concise hierarchical mind map based on the text below.
      Output the mind map using ONLY valid Mermaid.js graph syntax (graph TD).
      Do NOT include any markdown formatting like \`\`\`mermaid or text outside the graph code.
      Limit the mind map to a maximum of 3 levels deep.
      Use brief, clear labels for nodes.
      CRITICAL: You MUST wrap all node labels in double quotes to prevent syntax errors!
      
      Example:
      graph TD
        A["Main Topic"] --> B["Subtopic 1"]
        A --> C["Subtopic 2"]
      
      Document Text:
      {context}
      
      Mermaid Graph:
    `);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    let result = await chain.invoke({ context });
    
    // Clean up if LLM included markdown blocks despite instructions
    result = result.replace(/^\`\`\`(mermaid)?/im, '').replace(/\`\`\`$/im, '').trim();
    
    return { mermaidCode: result };
};

const chatWithDocument = async (documentId, query, chatHistory = []) => {
    const llm = getLLM('gemini-2.5-flash');
    
    // Using full document context since Gemini 2.5 Flash has a massive context window
    // and local MongoDB doesn't support $vectorSearch
    const context = await getDocumentContext(documentId);

    // Create prompt
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert study assistant. Answer the user's question based ONLY on the provided context from the document.
      If you don't know the answer based on the context, say "I couldn't find information about that in the document."
      
      Chat History:
      {chat_history}
      
      Context:
      {context}
      
      Question:
      {input}
      
      Answer:
    `);

    const formattedHistory = chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const answer = await chain.invoke({
        input: query,
        chat_history: formattedHistory,
        context: context
    });
    
    return answer;
};

module.exports = {
  getLLM,
  getEmbeddings,
  processDocument,
  generateSummary,
  generateNotes,
  generateQuiz,
  generateMindMap,
  chatWithDocument
};
