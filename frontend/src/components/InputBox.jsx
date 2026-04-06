import { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

export default function InputBox({ onSend, disabled }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSend(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
      <div className="relative flex-1">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please upload a PDF first..." : "Ask a question about your document..."}
          disabled={disabled}
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 text-sm h-12 overflow-hidden transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
        />
        <div className="absolute right-3 top-3 text-gray-400">
          <CornerDownLeft className="w-4 h-4 opacity-50" />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={disabled || !query.trim()}
        className="h-12 px-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
