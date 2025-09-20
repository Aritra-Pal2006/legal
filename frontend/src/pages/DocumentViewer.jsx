import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  Shield, 
  Languages, 
  Send,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

const DocumentViewer = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('document');
  const [translation, setTranslation] = useState(null);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [fairnessScore, setFairnessScore] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState('10th grade');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [copied, setCopied] = useState(false);

  // Available languages for translation
  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'French', name: 'Français', flag: '🇫🇷' },
    { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'Italian', name: 'Italiano', flag: '🇮🇹' },
    { code: 'Portuguese', name: 'Português', flag: '🇵🇹' },
    { code: 'Dutch', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'Russian', name: 'Русский', flag: '🇷🇺' },
    { code: 'Chinese', name: '中文', flag: '🇨🇳' },
    { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'Korean', name: '한국어', flag: '🇰🇷' },
    { code: 'Arabic', name: 'العربية', flag: '🇸🇦' },
    { code: 'Hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'Turkish', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'Polish', name: 'Polski', flag: '🇵🇱' },
    { code: 'Swedish', name: 'Svenska', flag: '🇸🇪' },
    { code: 'Norwegian', name: 'Norsk', flag: '🇳🇴' },
    { code: 'Danish', name: 'Dansk', flag: '🇩🇰' },
    { code: 'Finnish', name: 'Suomi', flag: '🇫🇮' },
    { code: 'Greek', name: 'Ελληνικά', flag: '🇬🇷' }
  ];

  // Load document on mount
  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  const loadDocument = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const docData = await response.json();
        setDocument(docData);
      } else {
        toast.error('Failed to load document');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Error loading document');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!document?.text) {
      toast.error('No document text to translate');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          documentId,
          text: document.text,
          difficultyLevel,
          language: selectedLanguage
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTranslation(result);
        setActiveTab('translation');
        toast.success('Translation completed!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Translation error response:', errorData);
        toast.error(`Translation failed: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleAnalyzeRisks = async () => {
    if (!document?.text) {
      toast.error('No document text to analyze');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/analyze-risks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          documentId,
          text: document.text
        })
      });

      if (response.ok) {
        const result = await response.json();
        setRiskAnalysis(result);
        setActiveTab('risks');
        toast.success('Risk analysis completed!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Risk analysis error response:', errorData);
        toast.error(`Risk analysis failed: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Risk analysis error:', error);
      toast.error('Risk analysis failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleFairnessAnalysis = async () => {
    if (!document?.text) {
      toast.error('No document text to analyze');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/fairness-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          documentId,
          text: document.text
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFairnessScore(result);
        setActiveTab('fairness');
        toast.success('Fairness analysis completed!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Fairness analysis error response:', errorData);
        toast.error(`Fairness analysis failed: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fairness analysis error:', error);
      toast.error('Fairness analysis failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage;
    setCurrentMessage('');
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          documentId,
          question: userMessage,
          conversationId
        })
      });

      if (response.ok) {
        const result = await response.json();
        setChatMessages(prev => [...prev, { type: 'assistant', content: result.answer }]);
        if (!conversationId) {
          setConversationId(result.conversationId);
        }
      } else {
        toast.error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Chat failed');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'HIGH_RISK': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'OBLIGATION': return <Info className="h-4 w-4 text-yellow-600" />;
      case 'USER_FRIENDLY': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Document not found</p>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{document.filename}</h1>
                <p className="text-sm text-gray-500">
                  Uploaded {new Date(document.uploadedAt?.seconds * 1000 || document.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleTranslate}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span>Translate</span>
              </button>
              <button
                onClick={handleAnalyzeRisks}
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Analyze Risks</span>
              </button>
              <button
                onClick={handleFairnessAnalysis}
                disabled={processing}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Fairness Score</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {['document', 'translation', 'risks', 'fairness', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'document' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Document Content</h3>
                <button
                  onClick={() => copyToClipboard(document.text)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {document.text}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'translation' && (
            <div>
              {!translation ? (
                <div className="text-center py-8">
                  <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No translation available</p>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Language Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Language
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Difficulty Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="5th grade">5th Grade</option>
                        <option value="10th grade">10th Grade</option>
                        <option value="business-level">Business Level</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleTranslate}
                    disabled={processing}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 mx-auto"
                  >
                    {processing ? (
                      <><Loader className="h-4 w-4 animate-spin" /><span>Translating...</span></>
                    ) : (
                      <><Languages className="h-4 w-4" /><span>Start Translation</span></>
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Languages className="h-5 w-5" />
                      <span>Plain Language Translation</span>
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Language: {languages.find(l => l.code === translation.language)?.flag} {translation.language}</span>
                      <span>Level: {translation.difficultyLevel}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyToClipboard(translation.translatedText)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy Translation'}</span>
                      </button>
                      
                      <button
                        onClick={() => setTranslation(null)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        <Languages className="h-4 w-4" />
                        <span>New Translation</span>
                      </button>
                    </div>
                    
                    {/* Translation Content */}
                    <div className="prose max-w-none">
                      <div className="text-gray-700 bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-2">
                          Translated to {languages.find(l => l.code === translation.language)?.name || translation.language}
                        </div>
                        <div className="whitespace-pre-wrap">{translation.translatedText}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'risks' && (
            <div>
              {!riskAnalysis ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No risk analysis available</p>
                  <button
                    onClick={handleAnalyzeRisks}
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {processing ? <Loader className="h-4 w-4 animate-spin" /> : 'Analyze Risks'}
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
                  
                  {riskAnalysis.summary && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Clauses:</span>
                          <span className="ml-1 font-medium">{riskAnalysis.summary.totalClauses}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">High Risk:</span>
                          <span className="ml-1 font-medium text-red-600">{riskAnalysis.summary.highRisk}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Obligations:</span>
                          <span className="ml-1 font-medium text-yellow-600">{riskAnalysis.summary.obligations}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">User Friendly:</span>
                          <span className="ml-1 font-medium text-green-600">{riskAnalysis.summary.userFriendly}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {riskAnalysis.clauses && riskAnalysis.clauses.length > 0 && (
                    <div className="space-y-4">
                      {riskAnalysis.clauses.map((clause, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(clause.category)}
                              <span className="font-medium">{clause.category.replace('_', ' ')}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(clause.riskLevel)}`}>
                              {clause.riskLevel}
                            </span>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-gray-600 italic">"{clause.text}"</p>
                          </div>
                          <p className="text-sm text-gray-700">{clause.explanation}</p>
                          {clause.recommendations && clause.recommendations.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-600 mb-1">Recommendations:</p>
                              <ul className="text-xs text-gray-600 list-disc list-inside">
                                {clause.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fairness' && (
            <div>
              {!fairnessScore ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No fairness analysis available</p>
                  <button
                    onClick={handleFairnessAnalysis}
                    disabled={processing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {processing ? <Loader className="h-4 w-4 animate-spin" /> : 'Analyze Fairness'}
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fairness Analysis</h3>
                  
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div>
                        <div className="text-4xl font-bold text-purple-600">{fairnessScore.fairnessScore}</div>
                        <div className="text-sm text-gray-600">out of 10</div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{fairnessScore.category}</div>
                        <div className="text-sm text-gray-600">{fairnessScore.summary}</div>
                      </div>
                    </div>
                  </div>

                  {fairnessScore.breakdown && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Detailed Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(fairnessScore.breakdown).map(([key, value]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-lg font-medium">{value}/10</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {fairnessScore.analysis && (
                    <div className="space-y-4">
                      {fairnessScore.analysis.strengths && fairnessScore.analysis.strengths.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {fairnessScore.analysis.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {fairnessScore.analysis.concerns && fairnessScore.analysis.concerns.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">Concerns</h4>
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {fairnessScore.analysis.concerns.map((concern, idx) => (
                              <li key={idx}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {fairnessScore.analysis.recommendations && fairnessScore.analysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-blue-600 mb-2">Recommendations</h4>
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {fairnessScore.analysis.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Chat with Document</h3>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Start a conversation about this document</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {processing && (
                  <div className="flex justify-start">
                    <div className="max-w-md px-4 py-2 rounded-lg bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question about this document..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;