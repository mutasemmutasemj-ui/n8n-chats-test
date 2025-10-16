import { useState, useRef, useEffect } from 'react';
import { Message, PageConfig } from '../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Loader2 } from 'lucide-react';
import { saveMessage, loadMessages } from '../services/messageService';

interface ChatPageProps {
  config: PageConfig;
}

export default function ChatPage({ config }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingHistory(true);
      const loadedMessages = await loadMessages(config.id);
      setMessages(loadedMessages);
      setIsLoadingHistory(false);
    };

    fetchMessages();
  }, [config.id]);

  const sendToWebhook = async (content: string, type: 'text' | 'audio' | 'image' | 'file') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(userMessage, config.id);
    setIsLoading(true);

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          type,
          timestamp: new Date().toISOString(),
          pageId: config.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: data.type || 'text',
        content: data.content || data.message || 'تم استلام رسالتك',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      await saveMessage(botMessage, config.id);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: 'عذراً، حدث خطأ في الإرسال. تأكد من إعداد webhook بشكل صحيح.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      <div className="hidden md:block bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 shadow-md">
        <h2 className="text-xl font-bold text-white">{config.name}</h2>
        <p className="text-sm text-blue-100 mt-1">متصل بـ webhook</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 bg-pattern">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="animate-spin text-blue-500 mx-auto mb-3" size={40} />
              <p className="text-gray-500 text-sm">جاري تحميل المحادثات...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 px-4">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-600 mb-2">ابدأ محادثة جديدة</p>
              <p className="text-sm text-gray-400">أرسل رسالتك الأولى للبدء</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSendMessage={sendToWebhook} disabled={isLoading} />
    </div>
  );
}
