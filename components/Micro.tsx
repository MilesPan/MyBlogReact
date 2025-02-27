import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";

const Micro = forwardRef(function Micro({children}: {children: React.ReactNode}, ref) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [microRect, setMicroRect] = useState({ width: 0, height: 0 });
  const microRef = useRef<HTMLDivElement | null>(null);
  
  // 更新组件尺寸的函数
  const updateMicroRect = useCallback(() => {
    if (microRef.current) {
      const { width, height } = microRef.current.getBoundingClientRect();
      setMicroRect({ width, height });
    }
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartPos({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
    
    // 在开始拖动前更新尺寸
    updateMicroRect();
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setHasMoved(true);
      let newX = e.clientX - startPos.x;
      let newY = e.clientY - startPos.y;
      
      // 获取屏幕宽度和高度
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 计算内容区域宽度（不包括滚动条）
      const contentWidth = document.documentElement.clientWidth;

      // 计算滚动条宽度
      const scrollbarWidth = screenWidth - contentWidth;

      // 防止Micro组件左边界超出屏幕
      newX = Math.max(newX, 0);

      // 防止Micro组件上边界超出屏幕
      newY = Math.max(newY, 0);

      // 防止Micro组件右边界超出屏幕
      newX = Math.min(newX, screenWidth - microRect.width - scrollbarWidth);

      // 防止Micro组件下边界超出屏幕
      newY = Math.min(newY, screenHeight - microRect.height - scrollbarWidth);

      setPosition({
        left: newX,
        top: newY,
      });
    }
  }, [isDragging, microRect.height, microRect.width, startPos.x, startPos.y]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 初始化时获取尺寸
  useEffect(() => {
    updateMicroRect();
  }, [updateMicroRect]);

  // 监听子组件变化，更新尺寸
  useEffect(() => {
    // 使用 MutationObserver 监听子元素变化
    const observer = new MutationObserver(updateMicroRect);
    
    if (microRef.current) {
      observer.observe(microRef.current, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', updateMicroRect);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateMicroRect);
    };
  }, [updateMicroRect]);

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

  useImperativeHandle(ref, () => {
    return {
      onMouseDown,
      getHasMoved: () => hasMoved,
      updateMicroRect // 暴露更新尺寸的方法
    }
  });
  
  return (
    <>
      <div
        className="container fixed z-9999 w-[fit-content]"
        style={{ left: `${position.left}px`, top: `${position.top}px` }}
        ref={microRef}
      >
        {/* <div className="operators flex items-center select-none">
          <div
            id="Move"
            className="move w-10 h-10 bg-white text-black rounded-md"
            onMouseDown={onMouseDown}
          >
            +
          </div>
          <div className="close">x</div>
        </div> */}
        <div className="micro w-[fit-content]">{children}</div>
      </div>
    </>
  );
});

export default Micro;
