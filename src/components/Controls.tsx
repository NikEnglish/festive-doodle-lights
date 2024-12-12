import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wand2, Save, Upload, Trash2 } from "lucide-react";

interface ControlsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onAutoPlace?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  onSave,
  onLoad,
  onClear,
  onAutoPlace
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
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onAutoPlace} className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Auto Place LEDs
        </Button>
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Config
        </Button>
        <Button onClick={onLoad} variant="secondary" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Load Config
        </Button>
        <Button onClick={onClear} variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
};