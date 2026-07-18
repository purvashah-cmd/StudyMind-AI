import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiFileText, FiCpu, FiMessageSquare, FiList, FiMap, FiCheckSquare } from 'react-icons/fi';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const Mermaid = ({ chart }) => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, [chart]);
  return <div className="mermaid flex justify-center">{chart}</div>;
};

const DocumentView = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocument();
    fetchExistingContent();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const { data } = await api.get('/documents');
      const doc = data.find(d => d._id === id);
      setDocument(doc);
    } catch (error) {
      console.error('Failed to fetch document', error);
    }
  };

  const fetchExistingContent = async () => {
    try {
      const { data } = await api.get(`/documents/${id}/content`);
      if (data && data.length > 0) {
        const newContentState = {};
        data.forEach(item => {
          newContentState[item.type] = item;
        });
        setContent(newContentState);
      }
    } catch (error) {
      console.error('Failed to fetch existing content', error);
    }
  };

  const generateContent = async (type) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/generate/${type}/${id}`);
      setContent(prev => ({ ...prev, [type]: data }));
    } catch (error) {
      console.error(`Failed to generate ${type}`, error);
      alert(`Failed to generate ${type}`);
    } finally {
      setLoading(false);
    }
  };

  if (!document) return <div className="p-12 text-center text-slate-500">Loading document...</div>;

  const tabs = [
    { id: 'summary', icon: FiFileText, label: 'Summary' },
    { id: 'notes', icon: FiList, label: 'Smart Notes' },
    { id: 'mindmap', icon: FiMap, label: 'Mind Map' },
    { id: 'quiz', icon: FiCheckSquare, label: 'Quiz' },
    { id: 'chat', icon: FiMessageSquare, label: 'AI Chat' }
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center space-x-5">
          <Link to="/app/documents" className="p-2.5 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm shrink-0 shadow-sm">
               {document.fileType.toUpperCase()}
             </div>
             <div>
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 line-clamp-1">{document.title}</h1>
               <div className="mt-1">
                 <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${document.status === 'processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                   {document.status === 'ready' ? 'Analyzed' : document.status}
                 </span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden space-x-4">
        {/* Sidebar Tabs */}
        <div className="w-56 flex flex-col space-y-2.5 pr-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 translate-x-2'
                  : 'glass-panel text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-md'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : ''}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-8 overflow-y-auto relative flex flex-col shadow-xl">
          {document.status !== 'ready' ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md z-10 rounded-3xl">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
               <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Analyzing Document...</h3>
               <p className="text-slate-500 dark:text-zinc-400 font-medium">StudyMind AI is reading your file. Please wait.</p>
             </div>
          ) : null}

          {/* Tab Content Header */}
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-zinc-700/50 pb-5">
            <h2 className="text-3xl font-extrabold capitalize bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{activeTab.replace('-', ' ')}</h2>
            {activeTab !== 'chat' && (
              <button 
                onClick={() => generateContent(activeTab)}
                disabled={loading}
                className="btn-primary flex items-center shadow-indigo-500/30"
              >
                <span className="relative z-10 flex items-center">
                  {loading ? 'Generating...' : `Generate ${activeTab.replace('-', ' ')}`}
                  {!loading && <FiCpu className="ml-2 w-5 h-5" />}
                </span>
              </button>
            )}
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 overflow-y-auto pr-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {!content[activeTab] && activeTab !== 'chat' ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-24 h-24 mb-6 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                       <FiCpu className="w-10 h-10 text-slate-300 dark:text-zinc-500" />
                    </div>
                    <p className="text-lg">Click Generate to create your {activeTab.replace('-', ' ')}.</p>
                  </div>
                ) : activeTab === 'summary' || activeTab === 'notes' ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-a:text-purple-600">
                     <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0 text-slate-700 dark:text-zinc-300 leading-relaxed">
                       {content[activeTab]?.data?.text || 'No content generated yet.'}
                     </pre>
                  </div>
                ) : activeTab === 'quiz' ? (
                  <div className="space-y-8">
                    {content.quiz?.data?.questions?.map((q, idx) => (
                      <div key={idx} className="bg-white/50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-xl mb-6 text-slate-800 dark:text-zinc-100"><span className="text-indigo-600 dark:text-indigo-400">Q{idx + 1}.</span> {q.question}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, i) => (
                            <label key={i} className="flex items-center space-x-4 p-4 rounded-xl border-2 border-slate-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all group">
                              <input type="radio" name={`question-${idx}`} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                              <span className="font-medium text-slate-700 dark:text-zinc-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{opt}</span>
                            </label>
                          ))}
                        </div>
                        {/* We could add a "Show Answer" button here */}
                      </div>
                    ))}
                  </div>
                ) : activeTab === 'mindmap' ? (
                  <div className="h-full flex flex-col items-center p-4">
                    {!content.mindmap?.data?.mermaidCode ? (
                      <div className="flex flex-col items-center justify-center text-slate-500 h-full">
                        <FiMap className="w-16 h-16 mb-4 opacity-20" />
                        <p>No mind map generated yet.</p>
                      </div>
                    ) : (
                      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-auto shadow-sm">
                         <Mermaid chart={content.mindmap.data.mermaidCode} />
                      </div>
                    )}
                  </div>
                ) : (
                  <ChatInterface documentId={id} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ documentId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [documentId]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get(`/chat/${documentId}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch chat history', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post(`/chat/${documentId}`, { content: userMsg.content });
      setMessages(prev => [...prev.filter(m => m !== userMsg), data.userMessage, data.aiMessage]);
    } catch (error) {
      console.error('Failed to send message', error);
      // rollback or show error
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto space-y-6 p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-700/50 mb-6 shadow-inner">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
               <FiMessageSquare className="w-8 h-8 text-indigo-400 dark:text-indigo-500" />
            </div>
            <p className="text-lg font-medium text-slate-500 dark:text-zinc-400">Ask a question about this document.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-100 dark:border-zinc-700 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white dark:bg-zinc-800 text-slate-500 border border-slate-100 dark:border-zinc-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex space-x-3 relative z-10">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the document..."
          className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/50 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          disabled={sending || !input.trim()}
          className="btn-primary"
        >
          <span className="relative z-10">Send</span>
        </button>
      </form>
    </div>
  );
};

export default DocumentView;
