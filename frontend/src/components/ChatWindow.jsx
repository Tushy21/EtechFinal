import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <Bot className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Welcome to Chat with Your PDF</h3>
        <p className="max-w-md text-sm">
          Upload a PDF document above to get started. Once uploaded, you can ask any questions about its content.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          
          {msg.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
          )}

          <div 
            className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
          </div>

          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}

        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
