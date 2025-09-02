import {
  gameControls,
  towerControls,
  navigationControls,
  towerManagement,
  targetingControls,
} from "./controls";

export const controlSections = [
  {
    title: "Game Controls",
    colorClass: "text-blue-600",
    controls: gameControls,
  },
  {
    title: "Tower Selection",
    colorClass: "text-green-600",
    controls: towerControls,
  },
  {
    title: "Navigation",
    colorClass: "text-purple-600",
    controls: navigationControls,
  },
  {
    title: "Tower Management",
    colorClass: "text-orange-600",
    controls: towerManagement,
  },
  {
    title: "Targeting Control",
    colorClass: "text-red-600",
    controls: targetingControls,
    note: "Note: Tower management and targeting shortcuts work when a tower is selected, both on the canvas and in the tower info dialog",
  },
];

export const accessibilitySections = [
  {
    title: "Screen Reader Support",
    colorClass: "text-blue-600",
    features: [
      "All game actions are announced via screen reader",
      "Live regions provide real-time game state updates",
      "Grid navigation announces position and tile information",
      "All UI elements have proper ARIA labels and descriptions",
    ],
  },
  {
    title: "Keyboard Navigation",
    colorClass: "text-green-600",
    features: [
      "Full keyboard control - no mouse required",
      "Visual focus indicators show current position",
      "Grid highlighting for keyboard navigation",
      "Tab order follows logical UI flow",
    ],
  },
  {
    title: "Visual Accessibility",
    colorClass: "text-purple-600",
    features: [
      "High contrast focus outlines",
      "Reduced motion support (respects user preferences)",
      "Clear visual feedback for all interactions",
      "Semantic color coding with text alternatives",
    ],
  },
];
