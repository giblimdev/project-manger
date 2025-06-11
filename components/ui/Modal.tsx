// components/ui/Modal.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  preventClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  preventClose = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}
          {!preventClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
