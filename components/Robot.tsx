import Micro from "./Micro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import Chat from "./Chat";

const Robot = () => {
  const microRef = useRef<{
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    getHasMoved: () => boolean;
    updateMicroRect: () => void;
  }>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMicroMouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<SVGSVGElement>
  ) => {
    microRef.current?.onMouseDown(e as React.MouseEvent<HTMLDivElement>);
  };

  const handleClick = () => {
    const hasMoved = microRef.current?.getHasMoved();
    if (!hasMoved) {
      setIsOpen(true);
    }
  };

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

 const afterResize = useCallback(() => {
  microRef.current?.updateMicroRect();
 }, []);

  return (
    <>
      <Micro ref={microRef}>
        {isOpen ? (
          <Chat  handleMicroMouseDown={handleMicroMouseDown} closeChat={closeChat} afterResize={afterResize} />
        ) : (
          <div
            key="robot"
            className={`md:(w-[40px] h-[40px])  border-2 border-green-500 bg-gray-100 rounded-full transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
            data-aos="fade-in"
          >
            <div
              className="w-full h-full flex items-center justify-center cursor-pointer"
              onMouseDown={handleMicroMouseDown}
              onClick={handleClick}
            >
              <FontAwesomeIcon
                icon={faRobot as IconProp}
                style={{ color: "#B197FC" }}
              />
            </div>
          </div>
        )}
      </Micro>
    </>
  );
};

export default Robot;
