// hooks/use-Modal.ts

import { useCallback, useEffect, useRef, useState } from "react";

type UseModalOptions = {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Hook de gestion d'une modale accessible
 */
export function useModal(options?: UseModalOptions) {
  const [isOpen, setIsOpen] = useState<boolean>(!!options?.initialOpen);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Gère le focus à l'ouverture/fermeture
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
    if (options?.onOpenChange) {
      options.onOpenChange(isOpen);
    }
  }, [isOpen, options]);

  // Ferme la modale sur ESC
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Ferme la modale sur clic backdrop
  const onBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  // API pour ouvrir/fermer/toggler
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
