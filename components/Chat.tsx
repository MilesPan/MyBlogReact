import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowsAlt,
  faStop,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";
import useResize from "../lib/useResize";
import { useChat } from "../lib/ChatContext";
import { useTextareaShortcuts } from "../lib/useTextareaShortcuts";
import { useAutoScroll } from "../lib/useAutoScroll";
import Message from "./Message";

const Chat = ({
  handleMicroMouseDown,
  closeChat,
  afterResize,
}: {
  handleMicroMouseDown: (e: React.MouseEvent<any>) => void;
  closeChat: () => void;
  afterResize: () => void;
}) => {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    greet,
    stopGenerating,
    isGenerating,
  } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { size, handleResizeStart } = useResize(
    chatContainerRef,
    { width: 700, height: 700 },
    afterResize
  );

  // 使用自动滚动 hook
  useAutoScroll(messages, messagesContainerRef);

  // 首次加载时发送问候语
  useEffect(() => {
    greet();
  }, [greet]);

  const handleSend = useCallback(async () => {
    if (!currentMessage.trim()) return;
    const messageToSend = currentMessage;
    setCurrentMessage("");
    await sendMessage(messageToSend);
  }, [currentMessage, sendMessage, setCurrentMessage]);

  // 使用快捷键 hook
  const { handleKeyDown } = useTextareaShortcuts({
    value: currentMessage,
    onChange: setCurrentMessage,
    onSubmit: handleSend,
  });

  return (
    <div
      ref={chatContainerRef}
      style={{ width: size.width, height: size.height }}
      className={`relative dark:bg-gray-800 bg-light-200 rounded-2xl transition-colors duration-300 pb-3 will-change-width-height border-2 border-purple-500`}
      data-aos="fade-in"
    >
      <div className="h-full w-full">
        <div className="p-3 flex justify-between h-[50px]">
          <FontAwesomeIcon
            className="cursor-move hover:opacity-70 transition-opacity"
            icon={faArrowsAlt as IconProp}
            style={{ color: "#B197FC" }}
            onMouseDown={handleMicroMouseDown}
          />
          <FontAwesomeIcon
            icon={faTimes as IconProp}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "#B197FC" }}
            onClick={closeChat}
          />
        </div>
        <div className="h-[calc(100%-50px)] flex flex-col justify-between">
          <div
            ref={messagesContainerRef}
            className="p-2 max-h-[calc(100%-90px)] overflow-y-auto scroll-smooth"
          >
            {messages.map((message, index) => (
              <Message
                key={index}
                content={message.content}
                role={message.role}
              />
            ))}
          </div>
          <div className="p-2 pb-0">
            <div className="flex items-center gap-2">
              <textarea
                className="textarea textarea-primary flex-1 cursor-text text-gray-500 dark:text-gray-400 font-mono"
                style={{ resize: "none" }}
                placeholder="请输入..."
                value={currentMessage}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              ></textarea>
              {isGenerating ? (
                <button 
                  className="btn btn-error animate-pulse relative group overflow-hidden"
                  onClick={stopGenerating}
                >
                  <span className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon 
                      icon={faStop as IconProp} 
                      className="animate-[spin_3s_linear_infinite] group-hover:animate-none"
                    />
                    <span className="hidden sm:inline">停止</span>
                  </div>
                </button>
              ) : (
                <button 
                  className="btn btn-primary hover:scale-105 transition-transform duration-200 disabled:opacity-50"
                  onClick={handleSend}
                  disabled={!currentMessage.trim()}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon 
                      icon={faPaperPlane as IconProp} 
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                    <span className="hidden sm:inline">发送</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-move z-10"
        onMouseDown={handleResizeStart}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full text-gray-400">
          <path
            fill="currentColor"
            d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Chat;
