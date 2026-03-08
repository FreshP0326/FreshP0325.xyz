"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ThemeSettings() {
  const [hue, setHue] = React.useState(250);

  React.useEffect(() => {
    const savedHue = localStorage.getItem("theme-hue");
    if (savedHue) {
      const val = parseInt(savedHue);
      setHue(val);
      document.documentElement.style.setProperty("--primary-hue", val.toString());
    }
  }, []);

  const handleHueChange = (val: number) => {
    setHue(val);
    document.documentElement.style.setProperty("--primary-hue", val.toString());
    localStorage.setItem("theme-hue", val.toString());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Theme settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-border/40 bg-card/90 backdrop-blur-md">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Accent Hue
              </label>
              <span className="text-xs font-mono text-primary font-bold">{hue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => handleHueChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex gap-2">
             {[250, 10, 140, 30, 200].map((h) => (
               <button
                 key={h}
                 onClick={() => handleHueChange(h)}
                 className="w-6 h-6 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110 active:scale-95"
                 style={{ backgroundColor: `hsl(${h} 80% 60%)` }}
               />
             ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
