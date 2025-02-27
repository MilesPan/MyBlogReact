import { markdownTest } from "./markdownText";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight as lightStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark as darkStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
const Chat = ({
  handleMicroMouseDown,
  closeChat,
  afterResize,
}: {
  handleMicroMouseDown: (e: React.MouseEvent<any>) => void;
  closeChat: () => void;
  afterResize: () => void;
}) => {
  const { resolvedTheme } = useTheme();
  const [size, setSize] = useState({ width: 700, height: 400 });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 700, height: 400 });
  const rafRef = useRef<number | null>(null);

  const [messages, setMessages] = useState([
    { bot: "你好", user: "你好" },
    { bot: "你不好", user: "我不好" },
  ]);

  const pushMessage = useCallback(
    (message: { bot: string; user: string }) => {
      setMessages([...messages, message]);
    },
    [messages]
  );
  const onClickSend = useCallback(() => {
    pushMessage({ bot: "我不好", user: "你好吗" });
  }, [pushMessage]);

  // 处理开始调整大小
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止文本选择
    if (chatContainerRef.current) {
      // 保存初始尺寸
      const { width, height } =
        chatContainerRef.current.getBoundingClientRect();
      startSizeRef.current = { width, height };
    }

    resizingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };

    // 添加临时样式类，优化性能
    document.body.classList.add("resizing");

    // 直接添加事件监听器
    document.addEventListener("mousemove", handleResizingMouseMove, {
      passive: true,
    });
    document.addEventListener("mouseup", handleResizingMouseUp);
  };
  const handleResizingMouseMove = (e: MouseEvent) => {
    handleResize(e);
  };
  const handleResizingMouseUp = () => {
    handleResizeEnd();
  };
  // 处理调整大小 - 使用 requestAnimationFrame 优化
  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;

    // 取消之前的动画帧
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // 请求新的动画帧
    rafRef.current = requestAnimationFrame(() => {
      if (!chatContainerRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      const newWidth = Math.max(300, startSizeRef.current.width + deltaX);
      const newHeight = Math.max(300, startSizeRef.current.height + deltaY);

      // 直接修改 DOM 样式，避免 React 状态更新和重渲染
      chatContainerRef.current.style.width = `${newWidth}px`;
      chatContainerRef.current.style.height = `${newHeight}px`;
    });
  }, []);

  // 处理结束调整大小
  const handleResizeEnd = useCallback(() => {
    if (!resizingRef.current) return;

    resizingRef.current = false;

    // 取消之前的动画帧
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // 移除临时样式类
    document.body.classList.remove("resizing");

    // 移除事件监听器
    document.removeEventListener("mousemove", handleResizingMouseMove);
    document.removeEventListener("mouseup", handleResizingMouseUp);

    // 更新 React 状态，保持同步
    if (chatContainerRef.current) {
      const { width, height } =
        chatContainerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }

    // 通知 Micro 组件更新尺寸
    setTimeout(() => {
      afterResize?.();
    }, 0);
  }, []);

  // 添加和移除事件监听器
  useEffect(() => {
    if (resizingRef.current) {
      document.addEventListener("mousemove", handleResizingMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleResizingMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleResizingMouseMove);
      document.removeEventListener("mouseup", handleResizingMouseUp);
    };
  }, [handleResize, handleResizeEnd]);

  return (
    <div
      key="chat"
      ref={chatContainerRef}
      style={{
        width: size.width,
        height: size.height,
      }}
      className={`relative dark:bg-gray-800 bg-light-200 rounded-2xl transition-colors duration-300 pb-3 will-change-width-height border-2 border-purple-500`}
      data-aos="fade-in"
    >
      <div className="h-full w-full">
        <div className="p-3 flex justify-between h-[50px]">
          <FontAwesomeIcon
            className="cursor-move hover:opacity-70 transition-opacity"
            icon={faArrowsAlt as IconProp}
            style={{ color: "#B197FC" }}
            onMouseDown={(e) => handleMicroMouseDown(e)}
          />
          <FontAwesomeIcon
            icon={faTimes as IconProp}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "#B197FC" }}
            onClick={closeChat}
          />
        </div>
        <div className="h-[calc(100%-50px)]">
          <div className="p-2 h-[calc(100%-50px)] overflow-y-auto">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const resolvedStyle =
                    resolvedTheme === "dark" ? darkStyle : lightStyle;
                  resolvedStyle['pre[class*="language-"]'].borderRadius =
                    "10px";

                  // 处理内联代码和代码块
                  if (!match) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <SyntaxHighlighter
                      language={match[1]}
                      PreTag="div"
                      style={resolvedStyle}
                      // 确保 inline 属性是字符串
                      inline={inline ? "true" : "false"}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {markdownTest}
            </ReactMarkdown>
          </div>
          <div className="p-2">
            <div className="flex items-center gap-2">
              <textarea
                className="textarea textarea-primary flex-1 cursor-text text-gray-500 dark:text-gray-400"
                placeholder="请输入..."
              ></textarea>
              <button className="btn btn-primary">发送</button>
            </div>
          </div>
        </div>
      </div>
      {/* 添加调整大小的手柄 */}
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
