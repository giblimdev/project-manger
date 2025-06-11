// hooks/use-Modal.ts
import { useCallback, useEffect, useRef, useState } from "react";

type UseModalOptions = {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useModal(options?: UseModalOptions) {
  const [isOpen, setIsOpen] = useState<boolean>(!!options?.initialOpen);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
    if (options?.onOpenChange) {
      options.onOpenChange(isOpen);
    }
  }, [isOpen, options]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = isOpen ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    dialogRef,
    onBackdropClick,
    setIsOpen,
  };
}
