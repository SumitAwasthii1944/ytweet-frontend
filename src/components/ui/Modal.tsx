import type { ReactNode } from "react";
import { createPortal } from "react-dom"; 
import Glass from "./Glass";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(  // renders directly into document.body, escapes all parent transforms
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-gradient-to-br from-white/20 to-transparent backdrop-brightness-125 backdrop-blur-xl border border-white/40
        w-full max-w-xl text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]
        rounded-2xl shadow-lg p-6 z-10 max-h-[90vh] overflow-y-auto mx-4">  {/* mx-4 for mobile padding */}
        
        {/* Header */}
        <Glass>
          <div className="flex justify-between items-center mb-4 px-2">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            <button onClick={onClose} className="text-gray-800 hover:text-black text-2xl">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-wrap">{children}</div>
        </Glass>
      </div>
    </div>,
    document.body  // portal target
  );
}

export default Modal;