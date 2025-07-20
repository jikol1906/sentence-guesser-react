import React, { useState, useEffect, useRef } from 'react';

// Define the props for the component
interface DrawerProps {
  children: React.ReactNode;
  title?: string;
}

export const Drawer: React.FC<DrawerProps> = ({ children, title = "Menu" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = () => {
      return setIsOpen(false);
  };
  const toggleDrawer = () => {
      return setIsOpen(prev => !prev);
  };

  // --- Effects ---
  // Close drawer on "Escape" key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && !hamburgerRef.current?.contains(event.target as Node)) {
        closeDrawer();
      }
    };

    if (isOpen) {
      // Delay attachment to prevent immediate close on button click
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* --- Hamburger Trigger Button --- */}
      <button
        onClick={toggleDrawer}
        ref={hamburgerRef}
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-label="Open menu"
      >
        <svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* --- Overlay --- */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
        aria-hidden="true"
      ></div>

      {/* --- Drawer Panel --- */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-slate-700 text-white shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* --- Drawer Content --- */}
          <main className="flex-grow p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};