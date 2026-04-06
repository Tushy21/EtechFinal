import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { api } from './services/api'

import FileUploadComponent from './components/FileUploadComponent'
import ChatWindow from './components/ChatWindow'
import InputBox from './components/InputBox'

function App() {
  const [messages, setMessages] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Optional: load history on mount if you persisted it across reloads
  useEffect(() => {
    // If you want history to persist frontend refreshes, un-comment below
    /*
    const loadHistory = async () => {
      try {
        const data = await api.getHistory();
        if (data.history && data.history.length > 0) {
          setMessages(data.history);
          setIsReady(true);
        }
      } catch (e) {
        console.error("Failed to load history.");
      }
    };
    loadHistory();
    */
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handleUploadSuccess = (msg) => {
    setIsReady(true);
    setMessages([]); // Clear chat for new PDF
    showToast(msg);
  };

  const handleSendQuery = async (query) => {
    if (!query.trim()) return;

    // Add user message optimistically
    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await api.queryPDF(query);
      setMessages([...newMessages, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.detail || "Sorry, I encountered an error while processing that request.";
      setMessages([...newMessages, { role: 'assistant', content: `Error: ${errMsg}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navbar Option */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Chat with Your PDF</h1>
        </div>
        <a 
          href="https://github.com/Tushy21/EtechFinal" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          GitHub Repository
        </a>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 flex flex-col md:flex-row gap-6 h-[calc(100vh-73px)]">
        
        {/* Left/Sidebar panel for Upload */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-6 flex space-x-2 w-full">
               <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm shrink-0">Step 1</span>  
               <span>Upload Context</span>
            </h2>
            <FileUploadComponent onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>

        {/* Right panel for Chat */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          
          {/* Toast Notification positioned absolutely in the chat container */}
          {toast.show && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-20 
              ${toast.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {toast.message}
            </div>
          )}

          <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">Step 2</span>
              <span>Ask Questions</span>
            </h2>
          </div>
          
          <ChatWindow messages={messages} isLoading={isTyping} />
          
          <InputBox onSend={handleSendQuery} disabled={!isReady || isTyping} />
        </div>
      </main>
    </div>
  )
}

export default App
