import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiCpu, FiLayout } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">StudyMind AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:scale-105 transition-transform inline-block shadow-lg">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Study 10x Faster with AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Transform Documents <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Into Knowledge.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload any PDF, text, or markdown file and instantly generate beautiful smart notes, comprehensive summaries, interactive quizzes, and visual mind maps.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup" className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center w-full sm:w-auto justify-center">
              Get Started for Free
              <FiArrowRight className="ml-2" />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full glass-panel font-medium text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full sm:w-auto justify-center">
              Login to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto text-left"
        >
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <FiCpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Summarization</h3>
            <p className="text-slate-600 dark:text-slate-400">Instantly condense long documents into short, easily digestible summaries using Gemini 2.5 Flash.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
              <FiLayout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Notes & Quizzes</h3>
            <p className="text-slate-600 dark:text-slate-400">Automatically generate markdown notes and multiple choice quizzes to test your understanding of the material.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Document Chat (RAG)</h3>
            <p className="text-slate-600 dark:text-slate-400">Chat directly with your study material. Ask any question and get precise answers cited from the text.</p>
          </div>
        </motion.div>
      </main>

    </div>
  );
};

export default Home;
