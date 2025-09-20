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
        try {
          const pdfData = await pdfParse(file.buffer, {
            max: 0,
            version: 'v1.10.100'
          });
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            throw new Error('No text content found in PDF');
          }
          return pdfData.text;
        } catch (pdfError) {
          console.warn('PDF parsing error:', pdfError.message);
          // Try alternative PDF parsing with different configurations
          try {
            const pdfDataAlt = await pdfParse(file.buffer, {
              normalizeWhitespace: false,
              disableCombineTextItems: false,
              // Add additional parsing options for problematic PDFs
              useWorker: false,
              verbosity: 0
            });
            if (pdfDataAlt.text && pdfDataAlt.text.trim().length > 0) {
              return pdfDataAlt.text;
            }
            throw new Error('No text found in alternative parsing');
          } catch (altError) {
            console.warn('Alternative PDF parsing also failed:', altError.message);
            // Third attempt with minimal configuration
            try {
              const pdfDataMinimal = await pdfParse(file.buffer, {
                // Minimal options for maximum compatibility
                normalizeWhitespace: true,
                disableCombineTextItems: true
              });
              if (pdfDataMinimal.text && pdfDataMinimal.text.trim().length > 0) {
                return pdfDataMinimal.text;
              }
            } catch (minimalError) {
              console.warn('Minimal PDF parsing failed:', minimalError.message);
            }
            
            // Return a fallback message that allows upload to proceed
            return 'This PDF file could not be processed for text extraction. The file may be corrupted, password-protected, contain only scanned images, or have formatting issues. You can still proceed with the upload, but AI analysis capabilities will be limited.';
          }
        }
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        try {
          const docxResult = await mammoth.extractRawText({ buffer: file.buffer });
          if (!docxResult.value || docxResult.value.trim().length === 0) {
            throw new Error('No text content found in document');
          }
          return docxResult.value;
        } catch (docxError) {
          console.warn('DOCX parsing error:', docxError.message);
          return 'This Word document could not be processed for text extraction. Please ensure the file is not corrupted and try again.';
        }
        
      case 'text/plain':
        try {
          const textContent = file.buffer.toString('utf8');
          if (!textContent || textContent.trim().length === 0) {
            throw new Error('Text file appears to be empty');
          }
          return textContent;
        } catch (textError) {
          console.warn('Text file parsing error:', textError.message);
          return 'This text file could not be processed. Please check the file encoding and try again.';
        }
        
      default:
        throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    // Don't throw error for extraction issues, return fallback message instead
    if (error.message.includes('Failed to extract text from file')) {
      return 'This file could not be processed for text extraction. You can still upload it, but AI analysis will be limited.';
    }
    throw error;
  }
};

// Upload and process document
router.post('/upload', verifyToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from the uploaded file
    let extractedText;
    let hasExtractionIssues = false;
    
    try {
      extractedText = await extractTextFromFile(req.file);
      
      // Check if extraction resulted in fallback message
      hasExtractionIssues = extractedText.includes('could not be processed') || 
                           extractedText.includes('Unable to extract readable text') ||
                           extractedText.includes('AI analysis will be limited');
                           
    } catch (extractionError) {
      console.warn('Text extraction failed:', extractionError.message);
      hasExtractionIssues = true;
      extractedText = `Text extraction failed for this ${req.file.mimetype} file. Error: ${extractionError.message}. You can still proceed with the upload.`;
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      hasExtractionIssues = true;
      extractedText = 'No text content could be extracted from this file. The file may be empty, corrupted, or in an unsupported format.';
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
      processed: !hasExtractionIssues,
      hasExtractionIssues,
      metadata: {
        size: req.file.size,
        wordCount: hasExtractionIssues ? 0 : extractedText.split(/\s+/).length,
        characterCount: extractedText.length
      }
    };

    // Save to Firestore
    await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .set(documentData);

    const response = {
      message: hasExtractionIssues ? 
        'Document uploaded successfully (with text extraction issues)' : 
        'Document uploaded and processed successfully',
      documentId,
      metadata: documentData.metadata,
      preview: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
      hasExtractionIssues
    };

    if (hasExtractionIssues) {
      response.warning = 'Text extraction encountered issues. AI analysis capabilities may be limited for this document.';
      response.suggestions = [
        'Ensure the document contains selectable text (not just images)',
        'Try converting to a different format if possible',
        'Check that the file is not password-protected or corrupted'
      ];
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message,
      suggestion: 'Please try again or use a different file format.'
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