import React, { useState, useRef, useEffect, ReactNode } from 'react';

// Prop types remain the same
interface ExpandableWrapperProps {
  children: ReactNode;
  maxHeight?: number;
  className?: string;
}

/**
 * A type-safe wrapper component that truncates content to a max height and provides
 * a subtle "Show More" button to expand it, styled for a dark UI.
 */
const ExpandableWrapper = ({
  children,
  maxHeight = 160,
  className = '',
} : ExpandableWrapperProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Add a small buffer (1px) to prevent floating point inaccuracies
      // from showing the button unnecessarily.
      const hasOverflow = contentRef.current.scrollHeight > maxHeight + 1;
      setIsOverflowing(hasOverflow);
    }
  }, [children, maxHeight]);

  const contentStyle = {
    maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : `${maxHeight}px`,
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={contentRef}
        style={contentStyle}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        {children}
      </div>

      {/* 
        This is the main change: The button is now styled to be very subtle.
        - `text-slate-400` for a muted gray color.
        - No bold or semibold font weight.
        - `hover:text-slate-200` to make it slightly brighter on hover.
        - `pt-4` gives it some space from the content above.
      */}
      {isOverflowing && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 text-sm hover:text-slate-200 focus:outline-hidden transition-colors duration-200"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableWrapper;