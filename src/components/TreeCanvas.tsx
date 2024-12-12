import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface TreeCanvasProps {
  width: number;
  height: number;
  onLedClick: (x: number, y: number) => void;
  leds: Array<{ x: number, y: number, color: string }>;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  width,
  height,
  onLedClick,
  leds
}) => {
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onLedClick(x, y);
  };

  return (
    <div 
      className="tree-container relative bg-background/50 rounded-lg border border-border"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)`
      }}
      onClick={handleCanvasClick}
    >
      {leds.map((led, index) => (
        <div
          key={index}
          className={cn("led absolute animate-led-pulse")}
          style={{
            left: `${led.x}px`,
            top: `${led.y}px`,
            backgroundColor: led.color,
            color: led.color,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};