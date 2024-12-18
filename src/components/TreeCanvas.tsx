import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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
    <div className="relative">
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
          <div
            key={index}
            className={cn(
              "led absolute cursor-pointer rounded-full",
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
              animationDuration: led.blinkSpeed ? `${led.blinkSpeed}s` : '2s',
              zIndex: selectedLed === index ? 51 : 1
            }}
            onClick={(e) => handleLedClick(index, e)}
          />
        ))}
      </div>
      
      {selectedLed !== null && leds[selectedLed] && (
        <div 
          className="fixed bg-card p-4 rounded-lg shadow-xl z-[1000]"
          style={{
            left: `${leds[selectedLed].x + 20}px`,
            top: `${leds[selectedLed].y}px`,
            minWidth: '200px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Color</label>
              <Input
                type="color"
                value={leds[selectedLed].color}
                onChange={(e) => onLedUpdate?.(selectedLed, { color: e.target.value })}
                className="h-10 w-full cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Brightness ({Math.round((leds[selectedLed].brightness || 1) * 100)}%)</label>
              <Slider
                value={[leds[selectedLed].brightness || 1]}
                onValueChange={(values) => onLedUpdate?.(selectedLed, { brightness: values[0] })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Size ({leds[selectedLed].size || 12}px)</label>
              <Slider
                value={[leds[selectedLed].size || 12]}
                onValueChange={(values) => onLedUpdate?.(selectedLed, { size: values[0] })}
                min={4}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Blink Speed ({leds[selectedLed].blinkSpeed || 0}s)</label>
              <Slider
                value={[leds[selectedLed].blinkSpeed || 0]}
                onValueChange={(values) => onLedUpdate?.(selectedLed, { blinkSpeed: values[0] })}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            <Button 
              variant="destructive"
              onClick={() => {
                onLedRemove?.(selectedLed);
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
  );
};