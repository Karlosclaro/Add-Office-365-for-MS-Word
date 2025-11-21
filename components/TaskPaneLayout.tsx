import React, { ReactNode } from 'react';

interface TaskPaneLayoutProps {
  children: ReactNode;
  title: string;
}

export const TaskPaneLayout: React.FC<TaskPaneLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 max-w-md mx-auto border-x border-gray-300 shadow-2xl relative">
      {/* Header mimicking Office Add-in header */}
      <header className="flex-none bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm z-20">
        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mr-3 text-white font-bold text-lg select-none">
          X
        </div>
        <h1 className="font-semibold text-lg text-gray-800">{title}</h1>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth relative z-10">
        {children}
      </main>
      
      {/* Branding Footer */}
      <footer className="flex-none bg-gray-100 border-t border-gray-200 py-2 text-center text-xs text-gray-500">
        Powered by Gemini AI
      </footer>
    </div>
  );
};
