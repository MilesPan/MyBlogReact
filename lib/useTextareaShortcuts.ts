import { useCallback } from 'react';

interface UseTextareaShortcutsProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function useTextareaShortcuts({
  value,
  onChange,
  onSubmit
}: UseTextareaShortcutsProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab 键插入空格
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // 插入两个空格作为缩进
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // 保持光标位置
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
    
    // Ctrl/Command + Enter 发送
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }

    // Command/Ctrl + / 插入代码块
    if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, start) + 
        '```\n' + selectedText + '\n```' + 
        value.substring(end);
      
      onChange(newValue);
      
      // 将光标移动到代码块中间
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4 + selectedText.length;
      });
    }

    // 其他快捷键可以在这里添加
  }, [value, onChange, onSubmit]);

  return { handleKeyDown };
} 