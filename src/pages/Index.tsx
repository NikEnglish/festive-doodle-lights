import { useState, useEffect } from "react";
import { TreeCanvas } from "@/components/TreeCanvas";
import { Controls } from "@/components/Controls";
import { useToast } from "@/components/ui/use-toast";

interface LED {
  x: number;
  y: number;
  color: string;
}

const Index = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(400);
  const [leds, setLeds] = useState<LED[]>([]);
  const { toast } = useToast();

  const handleLedClick = (x: number, y: number) => {
    setLeds([...leds, { x, y, color: "#E53E3E" }]);
  };

  const handleSave = () => {
    const data = { width, height, leds };
    localStorage.setItem("tree-config", JSON.stringify(data));
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