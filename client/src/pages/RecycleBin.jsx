import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiTrash2, FiRefreshCcw, FiAlertCircle } from 'react-icons/fi';

const RecycleBin = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents/recycled');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch recycled documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/documents/${id}/restore`);
      fetchDocuments();
    } catch (error) {
      console.error('Failed to restore', error);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await api.delete(`/documents/${id}/permanent`);
        fetchDocuments();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <FiTrash2 className="mr-3" /> Recycle Bin
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-slate-500">
          <FiAlertCircle className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Recycle Bin is empty</h2>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-sm text-slate-500">Document Title</th>
                <th className="p-4 font-semibold text-sm text-slate-500">Type</th>
                <th className="p-4 font-semibold text-sm text-slate-500">Deleted Date</th>
                <th className="p-4 font-semibold text-sm text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <motion.tr 
                  key={doc._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 font-medium">{doc.title}</td>
                  <td className="p-4 text-sm text-slate-500 uppercase">{doc.fileType}</td>
                  <td className="p-4 text-sm text-slate-500">{new Date(doc.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleRestore(doc._id)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Restore">
                      <FiRefreshCcw />
                    </button>
                    <button onClick={() => handlePermanentDelete(doc._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Permanently">
                      <FiTrash2 />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
