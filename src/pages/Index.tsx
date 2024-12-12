import { useState } from "react";
import { TreeCanvas } from "@/components/TreeCanvas";
import { Controls } from "@/components/Controls";
import { useToast } from "@/hooks/use-toast";

interface LED {
  x: number;
  y: number;
  color: string;
  brightness?: number;
  size?: number;
  blinkSpeed?: number;
}

const Index = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(400);
  const [leds, setLeds] = useState<LED[]>([]);
  const { toast } = useToast();

  const handleLedClick = (x: number, y: number) => {
    setLeds([...leds, { 
      x, 
      y, 
      color: "#ff0000", 
      brightness: 1,
      size: 12,
      blinkSpeed: 0
    }]);
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

  const handleAutoPlace = () => {
    const newLeds: LED[] = [];
    const numLeds = Math.floor((width * height) / 10000); // Approximate number based on tree size
    
    for (let i = 0; i < numLeds; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Check if point is within triangle
      const triangleHeight = height;
      const triangleBase = width;
      const triangleArea = (triangleBase * triangleHeight) / 2;
      
      const area1 = (width/2 * y) / 2;
      const area2 = ((width - x) * (height - y)) / 2;
      const area3 = (x * (height - y)) / 2;
      
      if (Math.abs(area1 + area2 + area3 - triangleArea) < 0.1) {
        newLeds.push({
          x,
          y,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          brightness: 1,
          size: 12,
          blinkSpeed: Math.random() * 2 + 1
        });
      }
    }
    
    setLeds(newLeds);
    toast({
      title: "Auto-placement complete",
      description: `Added ${newLeds.length} LEDs to the tree.`,
    });
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
        onAutoPlace={handleAutoPlace}
      />
    </div>
  );
};

export default Index;