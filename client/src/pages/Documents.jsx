import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiFileText, FiMoreVertical, FiTrash2, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
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

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-6 rounded-3xl border border-white/20 dark:border-white/5">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">My Documents</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-slate-500">
          <div className="w-24 h-24 mb-6 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700">
            <FiFileText className="w-10 h-10 text-slate-300 dark:text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3">No documents yet</h2>
          <p className="text-lg">Go to the Dashboard to upload your first document.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {documents.map((doc, index) => (
            <motion.div 
              key={doc._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="glass-panel p-6 relative group flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => handleDelete(doc._id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm" title="Move to Bin">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-start space-x-5 mb-6 pt-2">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
                    <span className="font-extrabold text-sm tracking-wider">{doc.fileType.toUpperCase()}</span>
                 </div>
                 <div className="pr-8 pt-1">
                   <h3 className="font-bold text-xl line-clamp-2 text-slate-800 dark:text-zinc-100 leading-tight" title={doc.title}>{doc.title}</h3>
                   <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                     <FiClock className="mr-1.5" />
                     {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-slate-600 dark:text-zinc-300">
                <div className="bg-slate-50/80 dark:bg-zinc-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-zinc-700/50">
                  <span className="block text-xs text-slate-400 dark:text-zinc-500 mb-1 font-medium uppercase tracking-wider">Size</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatSize(doc.fileSize)}</span>
                </div>
                <div className="bg-slate-50/80 dark:bg-zinc-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-zinc-700/50">
                  <span className="block text-xs text-slate-400 dark:text-zinc-500 mb-1 font-medium uppercase tracking-wider">Status</span>
                  <span className={`font-bold ${doc.status === 'ready' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-100 dark:border-zinc-700/50">
                <Link to={`/app/documents/${doc._id}`} className="block w-full text-center py-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 dark:hover:from-indigo-900/40 dark:hover:to-blue-900/40 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold transition-all shadow-sm">
                  Open Document
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
