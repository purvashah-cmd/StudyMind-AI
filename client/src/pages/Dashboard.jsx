import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiPieChart, FiActivity, FiSearch, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.split('.')[0]);

    setUploading(true);
    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to move this document to the Recycle Bin?')) {
      try {
        await api.delete(`/documents/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-6 rounded-3xl border border-white/20 dark:border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Ready to transform your study materials?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-10 flex flex-col justify-center items-center border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 bg-indigo-50/30 dark:bg-zinc-800/30 hover:bg-indigo-50/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer group relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.txt,.md"
          />
          <div className="w-20 h-20 bg-white dark:bg-zinc-900 shadow-xl rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <FiUploadCloud className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Upload a Document</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md text-lg">
            {uploading ? 'Processing your document...' : 'Drag and drop your PDF, TXT, or Markdown files here, or click to browse.'}
          </p>
        </motion.div>

        {/* Storage Overview */}
        <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-600 dark:text-purple-400 rounded-xl shadow-inner">
                <FiPieChart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">Storage</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Documents</span>
                  <span className="text-slate-800 dark:text-white">{documents.length} files</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 shadow-inner">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full shadow-md" style={{ width: `${Math.min(documents.length * 10, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Notes & Summaries</span>
                  <span className="text-slate-800 dark:text-white">--</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 shadow-inner">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full shadow-md" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <button className="relative z-10 w-full py-3 mt-8 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
            View Details
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center">
              <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg mr-3">
                <FiFileText className="text-slate-600 dark:text-slate-400 w-5 h-5" />
              </div>
              Recent Documents
            </h3>
            <Link to="/app/documents" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">View All &rarr;</Link>
          </div>
          
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-20 h-20 mb-4 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                <FiSearch className="w-8 h-8 text-slate-300 dark:text-zinc-500" />
              </div>
              <p className="text-lg">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 4).map(doc => (
                <div key={doc._id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-md">
                  <Link to={`/app/documents/${doc._id}`} className="flex items-center space-x-4 overflow-hidden flex-1 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {doc.fileType.toUpperCase()}
                    </div>
                    <div className="truncate pr-4">
                      <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate text-base">{doc.title}</p>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                        {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${doc.status === 'ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </div>
                    <button onClick={() => handleDelete(doc._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Move to Bin">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <h3 className="text-xl font-bold flex items-center mb-8">
            <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg mr-3">
              <FiActivity className="text-slate-600 dark:text-slate-400 w-5 h-5" />
            </div>
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full pb-20">
             <div className="w-20 h-20 mb-4 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                <FiActivity className="w-8 h-8 text-slate-300 dark:text-zinc-500 opacity-50" />
             </div>
             <p className="text-lg">No recent activity.</p>
             <p className="text-sm mt-2 text-slate-500">Start by analyzing a document!</p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
