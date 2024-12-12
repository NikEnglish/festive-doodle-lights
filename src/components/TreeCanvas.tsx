import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface TreeCanvasProps {
  width: number;
  height: number;
  onLedClick: (x: number, y: number) => void;
  leds: Array<{ x: number; y: number; color: string; brightness?: number }>;
  onLedRemove?: (index: number) => void;
  onLedUpdate?: (index: number, updates: Partial<LED>) => void;
}

interface LED {
  x: number;
  y: number;
  color: string;
  brightness?: number;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  width,
  height,
  onLedClick,
  leds,
  onLedRemove,
  onLedUpdate
}) => {
  const [selectedLed, setSelectedLed] = useState<number | null>(null);

  const handleLedClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedLed === index) {
      onLedRemove?.(index);
      setSelectedLed(null);
    } else {
      setSelectedLed(index);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onLedClick(x, y);
    setSelectedLed(null);
  };

  return (
    <div 
      className="tree-container relative bg-background/50 rounded-lg border-2 border-primary"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)`,
      }}
      onClick={handleCanvasClick}
    >
      {leds.map((led, index) => (
        <div key={index} className="relative">
          <div
            className={cn(
              "led absolute cursor-pointer animate-led-pulse",
              selectedLed === index && "ring-2 ring-white"
            )}
            style={{
              left: `${led.x}px`,
              top: `${led.y}px`,
              backgroundColor: led.color,
              opacity: led.brightness ? led.brightness : 1,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => handleLedClick(index, e)}
          />
          
          {selectedLed === index && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute z-10"
                  style={{
                    left: `${led.x + 20}px`,
                    top: `${led.y}px`,
                  }}
                >
                  Edit LED
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="p-2 space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <Input
                    type="color"
                    value={led.color}
                    onChange={(e) => onLedUpdate?.(index, { color: e.target.value })}
                    className="h-10 cursor-pointer"
                  />
                  <label className="text-sm font-medium">Brightness</label>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={led.brightness || 1}
                    onChange={(e) => onLedUpdate?.(index, { brightness: parseFloat(e.target.value) })}
                    className="cursor-pointer"
                  />
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      onLedRemove?.(index);
                      setSelectedLed(null);
                    }}
                    className="w-full"
                  >
                    Remove LED
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};