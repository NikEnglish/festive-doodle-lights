import { useState } from "react";
import { TreeCanvas } from "@/components/TreeCanvas";
import { Controls } from "@/components/Controls";
import { useToast } from "@/components/ui/use-toast";

interface LED {
  x: number;
  y: number;
  color: string;
  brightness?: number;
}

const Index = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(400);
  const [leds, setLeds] = useState<LED[]>([]);
  const { toast } = useToast();

  const handleLedClick = (x: number, y: number) => {
    setLeds([...leds, { x, y, color: "#ff0000", brightness: 1 }]);
  };

  const handleLedRemove = (index: number) => {
    const newLeds = leds.filter((_, i) => i !== index);
    setLeds(newLeds);
    toast({
      title: "LED removed",
      description: "The LED has been removed from the tree.",
    });
  };

  const handleLedUpdate = (index: number, updates: Partial<LED>) => {
    const newLeds = leds.map((led, i) => {
      if (i === index) {
        return { ...led, ...updates };
      }
      return led;
    });
    setLeds(newLeds);
  };

  const handleSave = () => {
    localStorage.setItem("tree-config", JSON.stringify({ width, height, leds }));
    toast({
      title: "Configuration saved",
      description: "Your tree configuration has been saved successfully.",
    });
  };

  const handleLoad = () => {
    const saved = localStorage.getItem("tree-config");
    if (saved) {
      const data = JSON.parse(saved);
      setWidth(data.width);
      setHeight(data.height);
      setLeds(data.leds);
      toast({
        title: "Configuration loaded",
        description: "Your tree configuration has been loaded successfully.",
      });
    }
  };

  const handleClear = () => {
    setLeds([]);
    toast({
      title: "Canvas cleared",
      description: "All LEDs have been removed.",
    });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Christmas Tree LED Simulator</h1>
      <div className="flex-1 w-full flex justify-center items-start mb-32">
        <TreeCanvas
          width={width}
          height={height}
          onLedClick={handleLedClick}
          leds={leds}
          onLedRemove={handleLedRemove}
          onLedUpdate={handleLedUpdate}
        />
      </div>
      <Controls
        width={width}
        height={height}
        onWidthChange={setWidth}
        onHeightChange={setHeight}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
      />
    </div>
  );
};

export default Index;