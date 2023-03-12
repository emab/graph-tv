import { createPortal } from 'react-dom';
import { ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

type MobileModal = {
  handleClose?: VoidFunction;
  children: ReactNode;
};

export const MobileModal = ({ handleClose, children }: MobileModal) => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'auto';
    };
  });
  return createPortal(
    <div className="fixed top-0 h-screen w-screen bg-gray-800">
      <div className="flex justify-end mb-2">
        <button
          className="p-4 bg-slate-600 rounded-bl"
          onClick={() => handleClose?.()}
        >
          <FaTimes />
        </button>
      </div>
      {children}
    </div>,
    document.body
  );
};
