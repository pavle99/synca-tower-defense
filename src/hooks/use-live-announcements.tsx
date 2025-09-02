import { useCallback, useRef } from "react";

export type AnnouncementPriority = "polite" | "assertive";

export function useLiveAnnouncements() {
  const politeRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = "polite") => {
      const region =
        priority === "assertive"
          ? assertiveRegionRef.current
          : politeRegionRef.current;

      if (region) {
        // Clear and then set the message to ensure it's announced
        region.textContent = "";
        setTimeout(() => {
          region.textContent = message;
        }, 10);
      }
    },
    []
  );

  const announceGameEvent = useCallback(
    (event: string, details?: string) => {
      const message = details ? `${event}: ${details}` : event;
      announce(message, "polite");
    },
    [announce]
  );

  const announceUrgent = useCallback(
    (message: string) => {
      announce(message, "assertive");
    },
    [announce]
  );

  const createLiveRegions = useCallback(() => {
    return (
      <>
        <div
          ref={politeRegionRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          data-testid="live-region-polite"
        />
        <div
          ref={assertiveRegionRef}
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
          data-testid="live-region-assertive"
        />
      </>
    );
  }, []);

  return {
    announce,
    announceGameEvent,
    announceUrgent,
    createLiveRegions,
  };
}
