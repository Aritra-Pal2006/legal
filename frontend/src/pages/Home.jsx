import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, MessageSquare, BarChart3, ChevronRight, Star, Users, Zap, Sparkles, Globe, Clock, CheckCircle, Award, TrendingUp, Brain } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Legal-themed Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle legal pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Cpath d='M15 30l15-15 15 15-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating geometric elements representing structure and law */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200/30 rounded-lg transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-indigo-200/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 border-2 border-slate-200/40 transform rotate-45 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-blue-100/30 rounded-lg transform -rotate-6 animate-pulse delay-700"></div>
      </div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Legal-themed background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-transparent"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          {/* Floating legal symbols */}
          <div className="absolute top-10 right-10 opacity-5">
            <Shield className="h-32 w-32 text-white transform rotate-12" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-5">
            <FileText className="h-24 w-24 text-white transform -rotate-12" />
          </div>
          <div className="absolute top-1/2 left-10 opacity-3">
            <BarChart3 className="h-28 w-28 text-white transform rotate-6" />
          </div>
        </div>
        
        {/* Floating Elements - Legal themed */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-slate-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Sparkles className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
              AI-Powered Legal Intelligence
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform complex legal documents into clear, actionable insights. Analyze risks, translate jargon, and chat with your documents using cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                Start Free Trial
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="group border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                Sign In
                <Users className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span className="text-sm">20+ Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Real-time Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-4">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for legal document analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI tools transforms how you work with legal documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Plain Language Translation</h3>
              <p className="text-gray-600 mb-4">Convert complex legal jargon into simple, understandable language that anyone can comprehend.</p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Analysis</h3>
              <p className="text-gray-600 mb-4">Identify potential risks, obligations, and critical clauses in your legal documents automatically.</p>
              <div className="flex items-center text-red-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Chat</h3>
              <p className="text-gray-600 mb-4">Ask questions about your documents and get instant, intelligent responses from our AI assistant.</p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fairness Score</h3>
              <p className="text-gray-600 mb-4">Evaluate the fairness and balance of agreements with our comprehensive scoring system.</p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold mb-1">99.9%</div>
                <div className="text-blue-200">Accuracy Rate</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all">
                <Users className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold mb-1">50k+</div>
                <div className="text-blue-200">Active Users</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all">
                <FileText className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold mb-1">1M+</div>
                <div className="text-blue-200">Documents Processed</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all">
                <Award className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold mb-1">4.9★</div>
                <div className="text-blue-200">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to transform your legal workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of legal professionals who trust our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/30 hover:bg-white/10 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;