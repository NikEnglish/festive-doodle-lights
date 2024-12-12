import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Settings2, Zap } from "lucide-react";

interface TreeCanvasProps {
  width: number;
  height: number;
  onLedClick: (x: number, y: number) => void;
  leds: Array<{ x: number; y: number; color: string; brightness?: number; size?: number; blinkSpeed?: number }>;
  onLedRemove?: (index: number) => void;
  onLedUpdate?: (index: number, updates: Partial<LED>) => void;
}

interface LED {
  x: number;
  y: number;
  color: string;
  brightness?: number;
  size?: number;
  blinkSpeed?: number;
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
    setSelectedLed(selectedLed === index ? null : index);
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
              "led absolute cursor-pointer",
              selectedLed === index && "ring-2 ring-white",
              led.blinkSpeed && "animate-led-pulse"
            )}
            style={{
              left: `${led.x}px`,
              top: `${led.y}px`,
              backgroundColor: led.color,
              opacity: led.brightness || 1,
              width: `${led.size || 12}px`,
              height: `${led.size || 12}px`,
              transform: 'translate(-50%, -50%)',
              animationDuration: led.blinkSpeed ? `${led.blinkSpeed}s` : '2s'
            }}
            onClick={(e) => handleLedClick(index, e)}
          />
          
          {selectedLed === index && (
            <div className="absolute z-20 bg-card p-4 rounded-lg shadow-xl" style={{
              left: `${led.x + 20}px`,
              top: `${led.y}px`,
              minWidth: '200px'
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Color</label>
                  <Input
                    type="color"
                    value={led.color}
                    onChange={(e) => onLedUpdate?.(index, { color: e.target.value })}
                    className="h-10 w-full cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Brightness</label>
                  <Slider
                    value={[led.brightness || 1]}
                    onValueChange={(values) => onLedUpdate?.(index, { brightness: values[0] })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Size</label>
                  <Slider
                    value={[led.size || 12]}
                    onValueChange={(values) => onLedUpdate?.(index, { size: values[0] })}
                    min={4}
                    max={24}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Blink Speed (seconds)</label>
                  <Slider
                    value={[led.blinkSpeed || 0]}
                    onValueChange={(values) => onLedUpdate?.(index, { blinkSpeed: values[0] })}
                    min={0}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};