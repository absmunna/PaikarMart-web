import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, FolderLock, File, User, Settings } from "lucide-react";

export default function VaultLayout() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Vault...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/client-vault/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Dark Navy Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <FolderLock className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">ClientVault</h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white font-medium">
            <File className="h-5 w-5" />
            My Files
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
            <User className="h-5 w-5" />
            Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-slate-300 truncate" title={user?.email || user?.phone || 'User'}>
              {user?.email || user?.phone || 'User'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-blue-400" />
            <span className="font-bold">ClientVault</span>
          </div>
          <button onClick={logout} className="p-2 text-slate-300 hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
