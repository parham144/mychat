'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'سلام! چطور می‌توانم به شما کمک کنم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // اسکرول خودکار به انتهای چت با آمدن پیام جدید
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault(); // جلوگیری از رفرش شدن صفحه در حالت فرم
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { role: 'assistant', content: `خطا: ${data.error || 'مشکلی در دریافت پاسخ رخ داده است.'}` }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'خطا در اتصال به سرور. لطفا اینترنت خود را بررسی کنید.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // مدیریت فشردن کلید اینتر روی Textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // جلوگیری از ایجاد خط جدید در تکست‌اریا
      handleSend();
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '30px auto',
      padding: '20px',
      fontFamily: 'tahoma, arial, sans-serif',
      direction: 'rtl'
    }}>
      {/* باکس نمایش پیام‌ها */}
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        height: '450px',
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        marginBottom: '20px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <strong style={{ color: msg.role === 'user' ? '#0066cc' : '#009933' }}>
              {msg.role === 'user' ? 'شما: ' : 'هوش مصنوعی: '}
            </strong>
            <p style={{
              margin: '5px 0 0 0',
              textAlign: 'justify',
              textAlignLast: 'right', // 👈 حل مشکل برعکس شدن خط آخر فارسی
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              color: '#333'
            }}>
              {msg.content}
            </p>
          </div>
        ))}
        {isLoading && (
          <div style={{ color: '#999', fontSize: '13px' }}>در حال نوشتن پاسخ...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* فرم ورودی پیام */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // 👈 ارسال با دکمه اینتر
          placeholder="پیام خود را بنویسید... (Enter برای ارسال، Shift+Enter برای خط بعد)"
          rows={2}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #aaa',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0 25px',
            backgroundColor: isLoading ? '#ccc' : '#009933',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '...' : 'ارسال'}
        </button>
      </form>
    </div>
  );
}