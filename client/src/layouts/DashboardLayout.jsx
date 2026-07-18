import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiHome, FiFolder, FiTrash2, FiSettings, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const navClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
    }`;

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
      <div className="p-6 font-bold text-2xl text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700">
        StudyMind AI
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <NavLink to="/app/dashboard" className={navClass}><FiHome /><span>Dashboard</span></NavLink>
        <NavLink to="/app/documents" className={navClass}><FiFolder /><span>Documents</span></NavLink>
        <NavLink to="/app/recycle-bin" className={navClass}><FiTrash2 /><span>Recycle Bin</span></NavLink>
        <NavLink to="/app/settings" className={navClass}><FiSettings /><span>Settings</span></NavLink>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { user, logout } = React.useContext(AuthContext);
  const { isDarkMode, toggleTheme } = React.useContext(ThemeContext);

  return (
    <div className="h-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10">
      <div className="font-semibold text-slate-800 dark:text-white md:hidden">StudyMind AI</div>
      <div className="hidden md:block text-slate-400">
         {/* Search can go here later */}
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
          {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block font-medium text-sm">{user?.name}</span>
        </div>
        <button onClick={logout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Logout">
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
