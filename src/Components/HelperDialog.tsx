import React, { useRef, useEffect, ReactNode } from 'react';

// --- Icon Component for the Close Button ---
// A simple functional component for the close icon.
const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- TypeScript Interface for Modal Props ---
interface HelperDialog {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// --- Generic Modal Component ---
// This component wraps the native HTML <dialog> element with TypeScript.
const HelperDialog: React.FC<HelperDialog> = ({ isOpen, onClose, children }) => {
  // Ref for the dialog element, with a specific TypeScript type.
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Effect to handle opening and closing the modal
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    if (isOpen) {
      // Show the modal if it's not already open
      if (!dialogNode.open) {
        dialogNode.showModal();
      }
    } else {
      // Close the modal if it is open
      if (dialogNode.open) {
        dialogNode.close();
      }
    }
  }, [isOpen]);

  // Effect to handle closing the modal via the 'close' event (e.g., ESC key)
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    // The 'close' event on a <dialog> doesn't need a specific handler type here,
    // as it's a standard DOM event.
    const handleClose = () => {
      if (onClose) {
        onClose();
      }
    };

    dialogNode.addEventListener('close', handleClose);

    // Cleanup function to remove the event listener
    return () => {
      dialogNode.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  // Handle clicks on the dialog backdrop to close the modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Only close if the click is on the dialog element itself (the backdrop)
    if (event.target === dialogRef.current) {
        if (onClose) {
            onClose();
        }
    }
  };


  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-black backdrop:bg-opacity-50 rounded-lg shadow-xl p-0 max-w-lg w-[90%]"
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg">
         {/* Modal Content */}
        <div className="p-6 pr-10">
            {children}
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CloseIcon />
        </button>
      </div>
    </dialog>
  );
};

export default HelperDialog;