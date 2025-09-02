import { useEffect, useCallback } from "react";

export interface KeyboardHandler {
  key: string;
  handler: (event: KeyboardEvent) => void;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboard(handlers: KeyboardHandler[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const {
        key,
        handler,
        ctrlKey,
        shiftKey,
        altKey,
        preventDefault,
      } of handlers) {
        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatches = ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatches = altKey ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          if (preventDefault !== false) {
            event.preventDefault();
          }
          handler(event);
          break;
        }
      }
    },
    [handlers, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
