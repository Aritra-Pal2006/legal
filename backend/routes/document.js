const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  }
});

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

// Extract text from different file types
const extractTextFromFile = async (file) => {
  try {
    switch (file.mimetype) {
      case 'application/pdf':
        const pdfData = await pdfParse(file.buffer);
        return pdfData.text;
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        const docxResult = await mammoth.extractRawText({ buffer: file.buffer });
        return docxResult.value;
        
      case 'text/plain':
        return file.buffer.toString('utf8');
        
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
};

// Upload and process document
router.post('/upload', verifyToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(req.file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the document' });
    }

    // Create document record
    const documentId = uuidv4();
    const documentData = {
      id: documentId,
      userId: req.user.uid,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      text: extractedText,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false,
      metadata: {
        size: req.file.size,
        wordCount: extractedText.split(/\s+/).length,
        characterCount: extractedText.length
      }
    };

    // Save to Firestore
    await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .set(documentData);

    res.status(201).json({
      message: 'Document uploaded successfully',
      documentId,
      metadata: documentData.metadata,
      preview: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : '')
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
});

// Get user's documents
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', req.user.uid)
      .get();

    const documents = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      documents.push({
        id: doc.id,
        filename: data.filename,
        fileType: data.fileType,
        uploadedAt: data.uploadedAt,
        metadata: data.metadata,
        processed: data.processed || false
      });
    });

    // Sort documents by uploadedAt in JavaScript
    documents.sort((a, b) => {
      if (!a.uploadedAt || !b.uploadedAt) return 0;
      return b.uploadedAt.toDate() - a.uploadedAt.toDate();
    });

    res.json({ documents });

  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents', 
      message: error.message 
    });
  }
});

// Get specific document
router.get('/:documentId', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const doc = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = doc.data();
    
    // Check if user owns this document
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...data
    });

  } catch (error) {
    console.error('Fetch document error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch document', 
      message: error.message 
    });
  }
});

// Delete document
router.delete('/:documentId', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const doc = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = doc.data();
    
    // Check if user owns this document
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete document and related data
    await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .delete();

    // Also delete any analysis results
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('documentId', '==', documentId)
      .get();

    const batch = admin.firestore().batch();
    analysisSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      error: 'Failed to delete document', 
      message: error.message 
    });
  }
});

module.exports = router;