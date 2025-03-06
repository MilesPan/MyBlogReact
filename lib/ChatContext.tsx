import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { useLocalStorageState } from 'ahooks';

const MAX_MESSAGES = 30;  // 设置最大消息数量

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatContextType = {
  messages: Message[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  sendMessage: (message: string, options?: { showInChat?: boolean }) => Promise<void>;
  greet: () => Promise<void>;
  stopGenerating: () => void;
  isGenerating: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // 使用 useLocalStorageState 替代普通的 useState
  const [messages, setMessages] = useLocalStorageState<Message[]>('chat-messages', {
    defaultValue: []
  });
  const [currentMessage, setCurrentMessage] = useLocalStorageState<string>('chat-current-message', {
    defaultValue: ''
  });
  const [hasGreeted, setHasGreeted] = useLocalStorageState<boolean>('chat-has-greeted', {
    defaultValue: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // 首次加载时发送问候语
  const greet = useCallback(async () => {
    if (!hasGreeted) {
      await sendMessage("你好", { showInChat: false });
      setHasGreeted(true);
    }
  }, [hasGreeted, setHasGreeted]);

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  }, []);

  const sendMessage = useCallback(async (message: string, options: { showInChat?: boolean } = {showInChat: true}) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsGenerating(true);

      if (options.showInChat) {
        const formattedMessage = message.replace(/\n/g, '  \n');
        setMessages(prev => {
          const newMessages = [...(prev || [])];
          // 如果消息数量超过限制，移除最早的消息
          if (newMessages.length >= MAX_MESSAGES) {
            newMessages.splice(0, 2); // 每次移除一组对话（用户消息和AI回复）
          }
          return [...newMessages, { role: 'user', content: formattedMessage }];
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => {
        const newMessages = [...(prev || [])];
        // 如果添加AI回复后会超过限制，移除最早的消息
        if (newMessages.length >= MAX_MESSAGES) {
          newMessages.splice(0, 2);
        }
        return [...newMessages, { role: 'assistant', content: '' }];
      });

      while (reader) {
        const { done, value } = await reader.read();
        if (done) {
          setIsGenerating(false);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        let contentToAdd = '';
        
        for (const line of lines) {
          if (line.trim() === '' || line === 'data: [DONE]') continue;
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(5));
              contentToAdd += json.choices[0].delta.content || '';
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }

        if (contentToAdd) {
          setMessages(prev => {
            const newMessages = [...(prev || [])];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === 'assistant') {
              lastMessage.content += contentToAdd;
            }
            return newMessages;
          });
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error sending message:', error);
      }
      setIsGenerating(false);
    }
  }, [setMessages]);

  return (
    <ChatContext.Provider value={{ 
      messages: messages || [], 
      currentMessage: currentMessage || '', 
      setCurrentMessage, 
      sendMessage,
      greet,
      stopGenerating,
      isGenerating
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 