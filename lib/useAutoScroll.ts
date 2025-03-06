import { useEffect, useRef, MutableRefObject } from 'react';
import { Message } from './ChatContext';

export function useAutoScroll(
  messages: Message[],
  containerRef: MutableRefObject<HTMLDivElement | null>
) {
  const observerRef = useRef<MutationObserver>();
  const scrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 平滑滚动函数
    const smoothScrollToBottom = () => {
      if (scrollingRef.current) return;
      scrollingRef.current = true;

      const targetScroll = container.scrollHeight;
      const startScroll = container.scrollTop;
      const distance = targetScroll - startScroll;
      const duration = 200; // 较短的动画时间
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuad 缓动函数
        const easing = progress * (2 - progress);
        container.scrollTop = startScroll + distance * easing;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          scrollingRef.current = false;
        }
      };

      requestAnimationFrame(animateScroll);
    };

    observerRef.current = new MutationObserver(() => {
      if (
        container.scrollHeight > container.clientHeight && 
        container.scrollTop + container.clientHeight + 100 >= container.scrollHeight
      ) {
        smoothScrollToBottom();
      }
    });

    observerRef.current.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 初始滚动
    smoothScrollToBottom();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef]);

  // 新消息时滚动
  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages.length]);
} 