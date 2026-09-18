import React, { useEffect } from 'react';

export const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  useEffect(() => {
    document.title = `${title} - MedReport`;
  }, [title]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Module Under Construction</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">This module will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
};
