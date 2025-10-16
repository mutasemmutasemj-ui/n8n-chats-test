import { Message } from '../types/chat';
import { FileText, Download } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-4 animate-fade-in`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-100'
        }`}
      >
        {message.type === 'text' && (
          <p className="whitespace-pre-wrap break-words text-sm md:text-base">{message.content}</p>
        )}

        {message.type === 'image' && (
          <img
            src={message.content}
            alt="Message attachment"
            className="max-w-full rounded-xl shadow-md"
            loading="lazy"
          />
        )}

        {message.type === 'audio' && (
          <audio controls className="max-w-full w-full md:w-64">
            <source src={message.content} type="audio/webm" />
            <source src={message.content} type="audio/wav" />
            متصفحك لا يدعم تشغيل الصوت
          </audio>
        )}

        {message.type === 'file' && (() => {
          try {
            const fileInfo = JSON.parse(message.content);
            const fileSizeInKB = (fileInfo.size / 1024).toFixed(2);
            return (
              <div className="flex items-center gap-3 p-2">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileInfo.name}</p>
                  <p className="text-xs opacity-70">{fileSizeInKB} KB</p>
                </div>
                <a
                  href={fileInfo.data}
                  download={fileInfo.name}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            );
          } catch {
            return <p className="text-sm">ملف</p>;
          }
        })()}

        <span className="text-[10px] md:text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
