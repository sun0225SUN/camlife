import React, { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnippetProps {
  text: string | string[];
  onCopy?: () => void;
}


export const Snippet = ({
  text,
  onCopy
}: SnippetProps) => {
  const [animation, setAnimation] = useState<boolean>(false);
  const animationTimeout = useRef<NodeJS.Timeout>(null);
  const _text = typeof text === "string" ? [text] : text;

  const onClick = () => {
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }
    setAnimation(true);
    animationTimeout.current = setTimeout(() => setAnimation(false), 2000);

    navigator.clipboard.writeText(_text.reduce((prev, curr) => prev + "\n" + curr));

    if (onCopy) {
      onCopy();
    }
  };

  return (
    <div
      className="relative flex items-center h-10 px-3 rounded-md border border-input bg-background gap-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
    >
      <div className="flex-1 min-w-0">
        {_text.map((item) => (
          <div
            key={item}
            className="font-mono text-sm overflow-x-auto whitespace-nowrap text-foreground">
            {item}
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 cursor-pointer relative w-4 h-4" onClick={onClick}>
        <Copy
          size={16}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-foreground",
            animation && "animate-fade-out"
          )}
        />
        <Check
          size={16}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-foreground",
            animation && "animate-fade-in"
          )}
        />
      </div>
    </div>
  );
};