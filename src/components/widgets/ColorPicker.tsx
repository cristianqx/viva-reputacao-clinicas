
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const predefinedColors = [
  "#9b87f5", // Primary
  "#6E59A5", // Dark Purple
  "#D6BCFA", // Light Purple
  "#8B5CF6", // Vivid Purple
  "#0EA5E9", // Ocean Blue
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#10B981", // Green
  "#F43F5E", // Pink
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#000000", // Black
  "#FFFFFF", // White
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Validate if it's a valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      onChange(value);
    }
  };
  
  const handleColorSelect = (selectedColor: string) => {
    setInputValue(selectedColor);
    onChange(selectedColor);
  };
  
  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <div 
                className="h-5 w-5 rounded border" 
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleColorSelect(presetColor)}
                  className={cn(
                    "h-6 w-6 rounded-md border border-gray-200",
                    color === presetColor && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: presetColor }}
                  type="button"
                  aria-label={`Selecionar cor ${presetColor}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1"
                placeholder="#000000"
              />
              <div 
                className="h-9 w-9 rounded border" 
                style={{ backgroundColor: inputValue }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
