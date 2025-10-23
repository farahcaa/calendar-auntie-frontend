// Notifier.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type NotifyOpts = {
  title: string;
  message: string;
  buttonText?: string;
};

type NotifierContextType = (opts: NotifyOpts) => Promise<void>;

const NotifierContext = createContext<NotifierContextType | null>(null);

export const useNotify = (): NotifierContextType => {
  const ctx = useContext(NotifierContext);
  if (!ctx) throw new Error("useNotify must be used within <NotifierProvider>");
  return ctx;
};

export const NotifierProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("OK");
  const resolverRef = useRef<(() => void) | null>(null);

  const hide = useCallback(() => {
    setOpen(false);
    // Resolve the promise the caller is awaiting
    resolverRef.current?.();
    resolverRef.current = null;
  }, []);

  const notify = useCallback<NotifierContextType>(
    ({ title, message, buttonText = "Got it" }) => {
      // If already open, immediately resolve any prior waiter (optional behavior)
      resolverRef.current?.();
      setTitle(title);
      setMessage(message);
      setButtonText(buttonText);
      setOpen(true);

      return new Promise<void>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    []
  );

  const value = useMemo(() => notify, [notify]);

  return (
    <NotifierContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="assertive"
          className={`fixed inset-0 ${open ? "grid" : "hidden"} place-items-center z-50 bg-black/45`}
          onClick={hide}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifier-title"
            aria-describedby="notifier-message"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white shadow-xl p-5"
          >
            <h3 id="notifier-title" className="text-lg font-semibold">
              {title}
            </h3>

            <p
              id="notifier-message"
              className="mt-2 text-sm text-gray-700 whitespace-pre-line"
            >
              {message}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={hide}
                className="rounded-xl border border-gray-200 px-3 py-2 bg-gray-900 text-white"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </NotifierContext.Provider>
  );
};
