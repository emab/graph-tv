import { createPortal } from 'react-dom';
import { ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

type Modal = {
  handleClose?: VoidFunction;
  children: ReactNode;
};

export const Modal = ({ handleClose, children }: Modal) => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'auto';
    };
  });
  return createPortal(
    <div className="fixed top-0 h-screen w-screen bg-gray-800 md:bg-neutral-800 md:bg-opacity-50 md:flex items-center justify-center">
      <div className="md:flex flex-col bg-gray-800 md:max-w-2xl md:w-8/12 md:max-h-max md:min-h-max md:h-fit md:border-2 md:mx-auto rounded border-neutral-400">
        <div className="flex justify-end mb-2">
          <button
            className="p-4 bg-slate-600 rounded-bl"
            onClick={() => handleClose?.()}
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
