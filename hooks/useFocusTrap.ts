"use client";
import { useEffect, useRef } from "react";

type TrapProps = {
  open: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement>;
};

/**
 * Focus trap hook — traps focus across ALL focusable elements inside container,
 * returns focus to the trigger on close, closes on Esc.
 */
export function useFocusTrap({ open, onClose, containerRef }: TrapProps) {
  const prevFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;

    prevFocusRef.current = document.activeElement;

    const container = containerRef.current;
    const focusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement || getComputedStyle(el).visibility !== "hidden");

    // Focus first focusable
    const items = focusable();
    if (items[0]) items[0].focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const els = focusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      // Return focus to trigger
      if (prevFocusRef.current instanceof HTMLElement) {
        prevFocusRef.current.focus();
      }
    };
  }, [open, onClose, containerRef]);
}
