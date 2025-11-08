import functions from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";
import OpenAI from "openai";

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Create embedding for a given text
async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// 🔹 Calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// 🔹 Cloud Function: Chat endpoint with RAG
export const chatWithRAG = functions.https.onRequest(async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    // 1️⃣ Create embedding for user query
    const queryEmbedding = await createEmbedding(query);

    // 2️⃣ Get knowledge docs from Firestore
    const snapshot = await db.collection("ncc_knowledge").get();
    const docs = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 3️⃣ Find most similar document by cosine similarity
    const scoredDocs = docs.map((doc) => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding),
    }));
    const bestDocs = scoredDocs
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    const contextText = bestDocs.map((d) => d.text).join("\n");

    // 4️⃣ Ask OpenAI using retrieved context
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an assistant that answers based on NCC knowledge.",
        },
        {
          role: "user",
          content: `Context:\n${contextText}\n\nQuestion: ${query}`,
        },
      ],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 One-time function: Embed Firestore knowledge base
export const embedKnowledge = functions.https.onRequest(async (req, res) => {
  const snapshot = await db.collection("ncc_knowledge").get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.embedding) {
      const embedding = await createEmbedding(data.text);
      await doc.ref.update({ embedding });
    }
  }
  res.send("Knowledge base embedded successfully!");
});
