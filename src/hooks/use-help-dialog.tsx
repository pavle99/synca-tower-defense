import { createContext, useContext, useState, type ReactNode } from "react";

interface HelpDialogContextType {
  isOpen: boolean;
  openHelp: () => void;
  toggleHelp: (isOpen?: boolean) => void;
  closeHelp: () => void;
}

const HelpDialogContext = createContext<HelpDialogContextType | undefined>(
  undefined
);

export function HelpDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHelp = () => setIsOpen(true);
  const toggleHelp = (isOpen?: boolean) => setIsOpen(isOpen ?? !isOpen);
  const closeHelp = () => setIsOpen(false);

  return (
    <HelpDialogContext.Provider
      value={{ isOpen, openHelp, toggleHelp, closeHelp }}
    >
      {children}
    </HelpDialogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHelpDialog() {
  const context = useContext(HelpDialogContext);
  if (context === undefined) {
    throw new Error("useHelpDialog must be used within a HelpDialogProvider");
  }
  return context;
}
