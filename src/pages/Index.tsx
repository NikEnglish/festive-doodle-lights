import { useState } from "react";
import { TreeCanvas } from "@/components/TreeCanvas";
import { Controls } from "@/components/Controls";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showControls, setShowControls] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLedClick = (x: number, y: number) => {
    // Check if point is within triangle before adding LED
    const triangleHeight = height;
    const triangleBase = width;
    
    // Calculate point position relative to triangle
    const px = x;
    const py = y;
    
    // Calculate barycentric coordinates
    const alpha = (triangleBase/2 * (triangleHeight - py) - (px - triangleBase/2) * triangleHeight) / (triangleBase/2 * triangleHeight);
    const beta = ((px - triangleBase/2) * triangleHeight) / (triangleBase/2 * triangleHeight);
    
    if (alpha >= 0 && beta >= 0 && (alpha + beta) <= 1) {
      setLeds([...leds, { 
        x, 
        y, 
        color: "#ff0000", 
        brightness: 1,
        size: 12,
        blinkSpeed: 0
      }]);
    }
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
    const numLeds = Math.floor((width * height) / 5000); // Increased number of LEDs
    
    for (let i = 0; i < numLeds; i++) {
      let validPoint = false;
      let x, y;
      
      // Keep trying until we find a valid point within the triangle
      while (!validPoint) {
        x = Math.random() * width;
        y = Math.random() * height;
        
        // Calculate barycentric coordinates
        const alpha = (width/2 * (height - y) - (x - width/2) * height) / (width/2 * height);
        const beta = ((x - width/2) * height) / (width/2 * height);
        
        if (alpha >= 0 && beta >= 0 && (alpha + beta) <= 1) {
          validPoint = true;
          newLeds.push({
            x,
            y,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            brightness: Math.random() * 0.5 + 0.5, // Random brightness between 0.5 and 1
            size: Math.floor(Math.random() * 8) + 8, // Random size between 8 and 16
            blinkSpeed: Math.random() * 2 + 1 // Random blink speed between 1 and 3 seconds
          });
        }
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

  // Calculate responsive dimensions
  const getResponsiveDimensions = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = viewportWidth > viewportHeight;
    
    if (isLandscape) {
      return {
        maxWidth: Math.min(viewportHeight * 0.6, width),
        maxHeight: Math.min(viewportHeight * 0.8, height)
      };
    }
    
    return {
      maxWidth: Math.min(viewportWidth * 0.8, width),
      maxHeight: Math.min(viewportHeight * 0.6, height)
    };
  };

  const { maxWidth, maxHeight } = getResponsiveDimensions();

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">Christmas Tree LED Simulator</h1>
      <div className="flex-1 w-full flex flex-col items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setShowControls(!showControls)}
          className="mb-2 w-full md:w-auto"
        >
          {showControls ? (
            <>
              Hide Controls <ChevronUp className="ml-2" />
            </>
          ) : (
            <>
              Show Controls <ChevronDown className="ml-2" />
            </>
          )}
        </Button>
        
        {showControls && (
          <div className="w-full max-w-xl mb-4">
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
        )}
        
        <div className={`mb-32 ${isMobile ? "" : "scale-100"}`} style={{ 
          transform: `scale(${Math.min(maxWidth/width, maxHeight/height)})`,
          transformOrigin: 'top center'
        }}>
          <TreeCanvas
            width={width}
            height={height}
            onLedClick={handleLedClick}
            leds={leds}
            onLedRemove={handleLedRemove}
            onLedUpdate={handleLedUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
