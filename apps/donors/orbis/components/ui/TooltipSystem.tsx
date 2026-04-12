import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface TooltipContextType {
  showTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  // FIX: Added explicit initial value 'undefined' to satisfy useRef argument requirement in strict environments
  const timeoutRef = useRef<number | undefined>(undefined);

  const showTooltip = (content: React.ReactNode, target: HTMLElement) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const rect = target.getBoundingClientRect();
    // Default to top center
    let x = rect.left + rect.width / 2;
    let y = rect.top - 8;

    // Flip if too close to top
    if (y < 40) y = rect.bottom + 8;

    setContent(content);
    setPosition({ x, y });
    
    // Small delay to prevent flickering
    timeoutRef.current = window.setTimeout(() => setVisible(true), 200);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {visible && content && (
        <div 
          className="fixed z-[100] px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-200 pointer-events-none transform -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-100"
          style={{ left: position.x, top: position.y }}
        >
          {content}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-700"></div>
        </div>
      )}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("useTooltip must be used within TooltipProvider");
  return ctx;
};

// FIX: Changed children type to React.ReactElement<any> to allow React.cloneElement to add event handler props without type mismatch
export const TooltipTrigger: React.FC<{ content: string; children: React.ReactElement<any> }> = ({ content, children }) => {
  const { showTooltip, hideTooltip } = useTooltip();
  return React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => showTooltip(content, e.currentTarget as HTMLElement),
    onMouseLeave: hideTooltip,
    onFocus: (e: React.FocusEvent) => showTooltip(content, e.currentTarget as HTMLElement),
    onBlur: hideTooltip
  });
};