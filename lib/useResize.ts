import { RefObject, useCallback, useEffect, useRef, useState } from "react";

const useResize = (
  containerRef: RefObject<HTMLElement>,
  defaultSize: { width: number; height: number },
  afterResize: () => void
) => {
  const [size, setSize] = useState(defaultSize);
  const resizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 700, height: 400 });
  const rafRef = useRef<number | null>(null);
  // 处理开始调整大小
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止文本选择
    if (containerRef.current) {
      // 保存初始尺寸
      const { width, height } = containerRef.current.getBoundingClientRect();
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
      if (
        e.clientX <= 0 ||
        e.clientX >= document.documentElement.clientWidth ||
        e.clientY <= 0 ||
        e.clientY >= document.documentElement.clientHeight
      )
        return;
      if (!containerRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      const newWidth = Math.max(300, startSizeRef.current.width + deltaX);
      const newHeight = Math.max(300, startSizeRef.current.height + deltaY);

      // 直接修改 DOM 样式，避免 React 状态更新和重渲染
      containerRef.current.style.width = `${newWidth}px`;
      containerRef.current.style.height = `${newHeight}px`;
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
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
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
  return {
    handleResizeStart,
    size,
  };
};
export default useResize;
