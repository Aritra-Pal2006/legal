const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

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

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile', 
      message: error.message 
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    await admin.auth().updateUser(req.user.uid, updateData);

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile', 
      message: error.message 
    });
  }
});

// Delete user account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Delete user's documents
    const documentsSnapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .get();

    const batch = admin.firestore().batch();
    documentsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's analysis
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('userId', '==', userId)
      .get();

    analysisSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's conversations
    const conversationsSnapshot = await admin.firestore()
      .collection('conversations')
      .where('userId', '==', userId)
      .get();

    conversationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete user account
    await admin.auth().deleteUser(userId);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      error: 'Failed to delete account', 
      message: error.message 
    });
  }
});

// Get user usage statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get document count
    const documentsSnapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .get();

    // Get analysis count
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('userId', '==', userId)
      .get();

    // Get conversation count
    const conversationsSnapshot = await admin.firestore()
      .collection('conversations')
      .where('userId', '==', userId)
      .where('type', '==', 'question')
      .get();

    const stats = {
      documentsUploaded: documentsSnapshot.size,
      analysisPerformed: analysisSnapshot.size,
      questionsAsked: conversationsSnapshot.size,
      accountCreated: req.user.auth_time * 1000 // Convert to milliseconds
    };

    res.json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get statistics', 
      message: error.message 
    });
  }
});

module.exports = router;