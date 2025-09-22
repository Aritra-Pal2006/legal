const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Initialize Google Generative AI with Gemini 1.5 Flash model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Add retry helper function
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Plain Language Translation
router.post('/translate', verifyToken, async (req, res) => {
  try {
    const { documentId, text, difficultyLevel = '10th grade', language = 'English' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Verify document ownership if documentId is provided
    if (documentId) {
      const doc = await admin.firestore()
        .collection('documents')
        .doc(documentId)
        .get();

      if (!doc.exists || doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const difficultyPrompts = {
      '5th grade': 'Explain this like you would to a 10-year-old child, using very simple words and short sentences.',
      '10th grade': 'Explain this using clear, everyday language that a high school student would understand.',
      'business-level': 'Explain this in professional but accessible language suitable for business professionals.'
    };

    const prompt = `
You are a legal expert helping everyday people understand legal documents.
${difficultyPrompts[difficultyLevel]}

${language === 'English' ? 
  `Convert the following legal text into plain ${language}:` : 
  `Translate and convert the following legal text into plain ${language}. Provide a clear, simple translation that maintains the legal meaning while making it accessible to everyday speakers of ${language}.`
}

"${text}"

Requirements:
- Keep the core meaning intact
- Use simple, everyday language appropriate for ${language} speakers
- Avoid legal jargon
- If specific legal terms must be used, explain them in parentheses
- Structure the explanation clearly
- Make it conversational and approachable
- If translating to a non-English language, ensure cultural and legal context is appropriate
- For non-English translations, provide natural, fluent text rather than literal word-for-word translation

${language === 'English' ? 'Simplified text:' : `Text in ${language}:`}`;

    // Use retry mechanism for AI call
    const result = await retryOperation(async () => {
      return await model.generateContent(prompt);
    });

    const response = await result.response;
    const translatedText = response.text().trim();

    // Save translation to database
    const translationId = uuidv4();
    const translationData = {
      id: translationId,
      userId: req.user.uid,
      documentId: documentId || null,
      originalText: text,
      translatedText,
      difficultyLevel,
      language,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'plain_language_translation'
    };

    await admin.firestore()
      .collection('analysis')
      .doc(translationId)
      .set(translationData);

    res.json({
      translationId,
      originalText: text,
      translatedText,
      difficultyLevel,
      language
    });

  } catch (error) {
    console.error('Translation error:', error);
    // Check if it's a rate limit error
    if (error.message.includes('rate') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        message: 'Too many requests. Please wait a moment and try again.',
        retryAfter: 60 // seconds
      });
    }
    res.status(500).json({ 
      error: 'Translation failed', 
      message: error.message 
    });
  }
});

// Risk and Obligation Analysis
router.post('/analyze-risks', verifyToken, async (req, res) => {
  try {
    const { documentId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Verify document ownership
    if (documentId) {
      const doc = await admin.firestore()
        .collection('documents')
        .doc(documentId)
        .get();

      if (!doc.exists || doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const prompt = `
You are a legal document analyzer. Analyze the following legal text and identify different types of clauses. 
Categorize each clause with color codes and provide explanations:

🔴 HIGH RISK: Penalties, waivers, indemnification, liability limitations, termination clauses
🟠 OBLIGATIONS: Payment terms, deadlines, performance requirements, compliance duties
🟢 USER-FRIENDLY: Cancellation rights, protection clauses, warranties, benefits

For each identified clause, provide:
1. The exact text of the clause
2. Color code category (🔴/🟠/🟢)
3. Brief explanation of what it means
4. Risk level (High/Medium/Low)
5. Start and end position in the text (approximate)

Legal text to analyze:
"${text}"

IMPORTANT: Respond ONLY with valid JSON in exactly this format. Do not include any markdown formatting or additional text:

{
  "clauses": [
    {
      "text": "exact clause text",
      "category": "HIGH_RISK",
      "colorCode": "🔴",
      "explanation": "what this means",
      "riskLevel": "High",
      "startPosition": 0,
      "endPosition": 100,
      "recommendations": ["suggestion 1", "suggestion 2"]
    }
  ],
  "summary": {
    "totalClauses": 1,
    "highRisk": 1,
    "obligations": 0,
    "userFriendly": 0,
    "overallRisk": "High"
  }
}`;

    // Use retry mechanism for AI call
    const result = await retryOperation(async () => {
      return await model.generateContent(prompt);
    });

    const response = await result.response;
    const responseText = response.text().trim();

    let analysisResult;
    try {
      // Clean up the response text to remove any markdown formatting
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.log('JSON Parse Error:', parseError);
      console.log('Raw Response:', responseText);
      // Fallback if JSON parsing fails
      analysisResult = {
        clauses: [],
        summary: { 
          totalClauses: 0, 
          highRisk: 0, 
          obligations: 0, 
          userFriendly: 0, 
          overallRisk: 'Medium' 
        },
        rawResponse: responseText,
        parseError: parseError.message
      };
    }

    // Save analysis to database
    const analysisId = uuidv4();
    const analysisData = {
      id: analysisId,
      userId: req.user.uid,
      documentId: documentId || null,
      text,
      analysis: analysisResult,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'risk_analysis'
    };

    await admin.firestore()
      .collection('analysis')
      .doc(analysisId)
      .set(analysisData);

    res.json({
      analysisId,
      ...analysisResult
    });

  } catch (error) {
    console.error('Risk analysis error:', error);
    // Check if it's a rate limit error
    if (error.message.includes('rate') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        message: 'Too many requests. Please wait a moment and try again.',
        retryAfter: 60 // seconds
      });
    }
    res.status(500).json({ 
      error: 'Risk analysis failed', 
      message: error.message 
    });
  }
});

// Fairness Score Analysis
router.post('/fairness-score', verifyToken, async (req, res) => {
  try {
    const { documentId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Verify document ownership
    if (documentId) {
      const doc = await admin.firestore()
        .collection('documents')
        .doc(documentId)
        .get();

      if (!doc.exists || doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const prompt = `
You are a legal document fairness analyzer. Analyze the fairness of this legal document/contract. Consider the balance of power, obligations, benefits, and risks between parties.

Rate the fairness on a scale of 0-10 where:
- 0-3: Heavily favors one party (very unfair)
- 4-6: Somewhat unbalanced but reasonable
- 7-8: Generally fair and balanced
- 9-10: Exceptionally fair and balanced

Analyze these aspects:
1. Balance of obligations and benefits
2. Risk distribution
3. Termination clauses
4. Payment terms
5. Liability and indemnification
6. Dispute resolution mechanisms
7. Modification and amendment procedures

Legal text:
"${text}"

IMPORTANT: Respond ONLY with valid JSON in exactly this format. Do not include any markdown formatting or additional text:

{
  "fairnessScore": 7,
  "category": "Generally Fair",
  "analysis": {
    "strengths": ["positive aspect 1", "positive aspect 2"],
    "concerns": ["concern 1", "concern 2"],
    "recommendations": ["recommendation 1", "recommendation 2"]
  },
  "breakdown": {
    "obligations": 7,
    "benefits": 6,
    "riskDistribution": 5,
    "terminationTerms": 8,
    "paymentTerms": 7,
    "disputeResolution": 6
  },
  "summary": "Brief summary of the fairness assessment"
}`;

    // Use retry mechanism for AI call
    const result = await retryOperation(async () => {
      return await model.generateContent(prompt);
    });

    const response = await result.response;
    const responseText = response.text().trim();

    let fairnessResult;
    try {
      // Clean up the response text to remove any markdown formatting
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      fairnessResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.log('Fairness JSON Parse Error:', parseError);
      console.log('Fairness Raw Response:', responseText);
      // Fallback if JSON parsing fails
      fairnessResult = {
        fairnessScore: 5,
        category: 'Analysis Error',
        analysis: {
          strengths: [],
          concerns: [],
          recommendations: []
        },
        breakdown: {},
        summary: 'Unable to parse analysis result',
        rawResponse: responseText,
        parseError: parseError.message
      };
    }

    // Save analysis to database
    const analysisId = uuidv4();
    const analysisData = {
      id: analysisId,
      userId: req.user.uid,
      documentId: documentId || null,
      text,
      fairnessAnalysis: fairnessResult,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'fairness_analysis'
    };

    await admin.firestore()
      .collection('analysis')
      .doc(analysisId)
      .set(analysisData);

    res.json({
      analysisId,
      ...fairnessResult
    });

  } catch (error) {
    console.error('Fairness analysis error:', error);
    // Check if it's a rate limit error
    if (error.message.includes('rate') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        message: 'Too many requests. Please wait a moment and try again.',
        retryAfter: 60 // seconds
      });
    }
    res.status(500).json({ 
      error: 'Fairness analysis failed', 
      message: error.message 
    });
  }
});

// Conversational Chat with Document
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { documentId, question, conversationId } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'Document ID and question are required' });
    }

    // Get document
    const doc = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const documentData = doc.data();

    // Get conversation history if conversationId provided
    let conversationHistory = [];
    if (conversationId) {
      const historySnapshot = await admin.firestore()
        .collection('conversations')
        .where('conversationId', '==', conversationId)
        .where('userId', '==', req.user.uid)
        .orderBy('timestamp', 'asc')
        .get();

      conversationHistory = historySnapshot.docs.map(doc => doc.data());
    }

    // Build context from conversation history
    const historyContext = conversationHistory.map(msg => 
      `${msg.type === 'question' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const prompt = `
You are a helpful legal assistant. Answer questions about the following legal document using only information from the document. Be conversational, clear, and helpful.

Document content:
"${documentData.text}"

${historyContext ? `Previous conversation:\n${historyContext}\n` : ''}

User question: "${question}"

Instructions:
- Base your answer strictly on the document content
- If the answer isn't in the document, say so clearly
- Use plain language and explain legal terms
- Be conversational and helpful
- Provide specific references to relevant clauses when possible
- If asked about legal advice, remind them to consult a lawyer for professional advice

Answer:`;

    // Use retry mechanism for AI call
    const result = await retryOperation(async () => {
      return await model.generateContent(prompt);
    });

    const response = await result.response;
    const answer = response.text().trim();

    // Save conversation
    const chatId = uuidv4();
    const newConversationId = conversationId || uuidv4();
    
    // Save question
    await admin.firestore()
      .collection('conversations')
      .doc(`${chatId}_q`)
      .set({
        id: `${chatId}_q`,
        conversationId: newConversationId,
        userId: req.user.uid,
        documentId,
        type: 'question',
        content: question,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    // Save answer
    await admin.firestore()
      .collection('conversations')
      .doc(`${chatId}_a`)
      .set({
        id: `${chatId}_a`,
        conversationId: newConversationId,
        userId: req.user.uid,
        documentId,
        type: 'answer',
        content: answer,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      conversationId: newConversationId,
      question,
      answer,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    // Check if it's a rate limit error
    if (error.message.includes('rate') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        message: 'Too many requests. Please wait a moment and try again.',
        retryAfter: 60 // seconds
      });
    }
    res.status(500).json({ 
      error: 'Chat failed', 
      message: error.message 
    });
  }
});

// Get conversation history
router.get('/conversations/:documentId', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    // Verify document ownership
    const doc = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const snapshot = await admin.firestore()
      .collection('conversations')
      .where('documentId', '==', documentId)
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'asc')
      .get();

    const conversations = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!conversations[data.conversationId]) {
        conversations[data.conversationId] = [];
      }
      conversations[data.conversationId].push(data);
    });

    res.json({ conversations });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      error: 'Failed to get conversations', 
      message: error.message 
    });
  }
});

module.exports = router;