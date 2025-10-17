import { useState, useRef } from 'react';
import { Send, Mic, Image, StopCircle, FileText, Paperclip, Camera } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'audio' | 'image' | 'file' | 'video') => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const handleSendText = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage(audioUrl, 'audio');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('لا يمكن الوصول إلى الميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onSendMessage(imageUrl, 'image');
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setShowAttachMenu(false);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onSendMessage(imageUrl, 'image');
      };
      reader.readAsDataURL(file);
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    setShowAttachMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        const fileInfo = JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          data: fileData
        });
        onSendMessage(fileInfo, 'file');
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 md:p-4 safe-area-bottom shadow-lg">
      <div className="flex items-end gap-2 md:gap-3 relative">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            disabled={disabled}
            className="p-2.5 text-blue-500 hover:text-blue-700 active:bg-blue-50 hover:bg-blue-50 rounded-xl disabled:opacity-50 flex-shrink-0 touch-manipulation transition-colors"
            title="إرفاق ملف"
          >
            <Paperclip size={22} className="md:w-6 md:h-6" />
          </button>

          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-1 flex flex-col gap-1 min-w-[160px] z-50">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 rounded-lg text-right transition-colors"
              >
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Camera size={18} className="text-blue-600" />
                </div>
                <span className="font-medium">كاميرا</span>
              </button>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 rounded-lg text-right transition-colors"
              >
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Image size={18} className="text-blue-600" />
                </div>
                <span className="font-medium">صورة</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 rounded-lg text-right transition-colors"
              >
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <span className="font-medium">ملف</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`p-2.5 rounded-xl disabled:opacity-50 flex-shrink-0 touch-manipulation transition-colors ${
            isRecording
              ? 'text-red-500 hover:text-red-700 active:bg-red-100 hover:bg-red-50 animate-pulse'
              : 'text-blue-500 hover:text-blue-700 active:bg-blue-50 hover:bg-blue-50'
          }`}
          title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
        >
          {isRecording ? <StopCircle size={22} className="md:w-6 md:h-6" /> : <Mic size={22} className="md:w-6 md:h-6" />}
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالتك..."
          disabled={disabled}
          className="flex-1 resize-none border-2 border-gray-200 rounded-2xl px-4 py-2.5 text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:bg-gray-50 min-h-[44px] transition-all"
          rows={1}
          style={{ maxHeight: '120px' }}
        />

        <button
          onClick={handleSendText}
          disabled={disabled || !message.trim()}
          className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 touch-manipulation transition-all shadow-md"
          title="إرسال"
        >
          <Send size={22} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
