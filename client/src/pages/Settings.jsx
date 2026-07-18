import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiSettings, FiUser, FiMoon, FiSun, FiShield } from 'react-icons/fi';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <FiSettings className="mr-3" /> Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg cursor-pointer">
             Account Profile
           </div>
           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-lg cursor-pointer transition-colors">
             Preferences
           </div>
           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-lg cursor-pointer transition-colors">
             Security
           </div>
        </div>

        <div className="md:col-span-2 space-y-6">
           <div className="glass-panel p-6">
             <h2 className="text-xl font-semibold mb-4 flex items-center">
               <FiUser className="mr-2 text-slate-400" /> Profile Information
             </h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Name</label>
                 <input type="text" value={user?.name || ''} readOnly className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                 <input type="email" value={user?.email || ''} readOnly className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" />
               </div>
               <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium text-sm">
                 Edit Profile (Coming Soon)
               </button>
             </div>
           </div>

           <div className="glass-panel p-6">
             <h2 className="text-xl font-semibold mb-4 flex items-center">
               <FiShield className="mr-2 text-slate-400" /> Application Preferences
             </h2>
             <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                <div>
                  <p className="font-medium">Theme Appearance</p>
                  <p className="text-sm text-slate-500">Toggle between Light and Dark mode.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
