import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, MessageSquarePlus } from 'lucide-react';
import { Message } from '../types';

export const Messages: React.FC = () => {
  const { messages, addMessage, deleteMessage } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', content: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) return;
    
    const newMsg: Message = {
      id: `MSG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      author: user?.name || 'System',
      date: new Date().toISOString()
    };
    addMessage(newMsg);
    setFormData({ subject: '', content: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Staff Messages</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Internal communication broadcasts.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New Broadcast
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">Post a Message</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-2 border rounded-xl"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              required
            />
            <textarea
              placeholder="Message content..."
              className="w-full px-4 py-2 border rounded-xl min-h-[100px]"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              required
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Post Message</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative group">
            {user?.role === 'admin' && (
              <button 
                onClick={() => deleteMessage(msg.id)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">{msg.subject}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Posted by <span className="font-medium text-slate-700">{msg.author}</span> on {new Date(msg.date).toLocaleString()}</p>
            <p className="text-slate-700">{msg.content}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
};
