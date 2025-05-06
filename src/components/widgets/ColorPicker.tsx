
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const commonColors = [
  "#1a1f2c", "#6e59a5", "#7e69ab", "#9b87f5", "#8b5cf6", "#d946ef", "#ea384c",
  "#f97316", "#0ea5e9", "#28a745", "#ffc107", "#ffffff", "#000000", "#333333"
];

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value || "#000000");
  
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };
  
  const isValidHex = (color: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-10 h-10 rounded-md border border-gray-200 shadow-sm"
              style={{ backgroundColor: isValidHex(color) ? color : "#ffffff" }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {commonColors.map((colorOption) => (
                  <button
                    key={colorOption}
                    className={`w-8 h-8 rounded-md border ${
                      color === colorOption ? "ring-2 ring-primary ring-offset-2" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: colorOption }}
                    onClick={() => handleColorChange(colorOption)}
                    aria-label={`Select color ${colorOption}`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={isValidHex(color) ? color : "#ffffff"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 p-0 border-0"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
