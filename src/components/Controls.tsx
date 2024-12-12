import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface ControlsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  onSave,
  onLoad,
  onClear
}) => {
  return (
    <div className="controls-panel space-y-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tree Width</label>
          <Slider
            value={[width]}
            onValueChange={(values) => onWidthChange(values[0])}
            min={100}
            max={800}
            step={10}
          />
          <span className="text-xs text-muted-foreground">{width}px</span>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tree Height</label>
          <Slider
            value={[height]}
            onValueChange={(values) => onHeightChange(values[0])}
            min={100}
            max={800}
            step={10}
          />
          <span className="text-xs text-muted-foreground">{height}px</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="flex-1">Save Configuration</Button>
        <Button onClick={onLoad} variant="secondary" className="flex-1">Load Configuration</Button>
        <Button onClick={onClear} variant="destructive" className="flex-1">Clear All LEDs</Button>
      </div>
    </div>
  );
};