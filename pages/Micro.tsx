import React, { useState, useEffect, useRef, useCallback } from "react";

const Micro = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [microRect, setMicroRect] = useState({ width: 0, height: 0 });
  const microRef = useRef<HTMLDivElement | null>(null);
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      let newX = e.clientX - startPos.x;
      let newY = e.clientY - startPos.y;
      // 获取屏幕宽度和高度
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;


      // 计算内容区域宽度（不包括滚动条）
      const contentWidth = document.documentElement.clientWidth;

      // 计算滚动条宽度
      const scrollbarWidth = screenWidth - contentWidth;
      // 获取Micro组件的宽度和高度（这里是固定值，如果是动态的，需要相应调整）

      // 防止Micro组件左边界超出屏幕
      newX = Math.max(newX, 0);

      // 防止Micro组件上边界超出屏幕
      newY = Math.max(newY, 0);

      // 防止Micro组件右边界超出屏幕
      newX = Math.min(newX, screenWidth - microRect.width -scrollbarWidth);

      // 防止Micro组件下边界超出屏幕
      newY = Math.min(newY, screenHeight - microRect.height - scrollbarWidth);

      setPosition({
        left: newX,
        top: newY,
      });
    }
  }, [isDragging,position]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [isDragging,position]);

  useEffect(() => {
    const { width, height } = microRef.current!.getBoundingClientRect();
    setMicroRect({ width, height });
  }, []);
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return (
    <>
      <div
        className="container w-[30vw] h-[50vh] fixed z-9999"
        style={{ left: `${position.left}px`, top: `${position.top}px` }}
        ref={microRef}
      >
        <div className="operators flex items-center select-none">
          <div
            id="Move"
            className="move w-10 h-10 bg-white text-black rounded-md"
            onMouseDown={onMouseDown}
          >
            +
          </div>
          <div className="close">x</div>
        </div>
        <div className="micro w-full h-[calc(100%-2.5rem)] bg-red-400">123</div>
      </div>
    </>
  );
};

export default Micro;
