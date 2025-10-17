import { useState } from 'react';
import { PageConfig } from './types/chat';
import ChatPage from './components/ChatPage';
import { Menu, X } from 'lucide-react';

const pages: PageConfig[] = [
  { id: 'page1', name: 'الصفحة الأولى', webhookUrl: 'https://n8n.jadallah.work/webhook-test/page1' },
  { id: 'page2', name: 'الصفحة الثانية', webhookUrl: 'https://your-n8n-instance.com/webhook/page2' },
  { id: 'page3', name: 'الصفحة الثالثة', webhookUrl: 'https://your-n8n-instance.com/webhook/page3' },
  { id: 'page4', name: 'الصفحة الرابعة', webhookUrl: 'https://your-n8n-instance.com/webhook/page4' },
  { id: 'page5', name: 'الصفحة الخامسة', webhookUrl: 'https://your-n8n-instance.com/webhook/page5' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageConfig>(pages[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePageChange = (page: PageConfig) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-100" dir="rtl">
      <div
        className={`
          fixed md:relative inset-y-0 right-0 z-50
          w-72 md:w-64 bg-white border-l shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? 'translate-x-0'
              : 'translate-x-full md:translate-x-0'
          }
        `}
      >
        <div className="p-5 md:p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">نظام الشات</h1>
            <p className="text-xs md:text-sm text-blue-100 mt-1">اختر صفحة للبدء</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handlePageChange(page)}
              className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPage.id === page.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-blue-50 active:bg-blue-100'
              }`}
            >
              <span className="font-medium">{page.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            قم بتحديث عناوين webhook في الكود
          </p>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col w-full md:w-auto">
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg active:bg-white active:bg-opacity-30 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">{currentPage.name}</h2>
          <div className="w-10"></div>
        </div>

        <ChatPage key={currentPage.id} config={currentPage} />
      </div>
    </div>
  );
}

export default App;
