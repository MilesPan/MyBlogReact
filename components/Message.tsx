import { memo } from 'react';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight as lightStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark as darkStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

const Message = memo(({ content, role }: { content: string; role: 'user' | 'assistant' }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`mb-4 ${
        role === "assistant"
          ? "bg-gray-100 dark:bg-gray-700 rounded-lg p-3 w-[90%]"
          : "bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-1/2 ml-auto"
      }`}
    >
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const resolvedStyle = resolvedTheme === "dark" ? darkStyle : lightStyle;
            resolvedStyle['pre[class*="language-"]'].borderRadius = "10px";

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
                inline={inline ? "true" : "false"}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

Message.displayName = 'Message';

export default Message; 