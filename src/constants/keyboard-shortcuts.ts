export const KEYBOARD_SHORTCUTS = {
  // Game controls
  PAUSE: " ", // Space
  SPEED_TOGGLE: "s",
  RESTART: "r",
  START_WAVE: "w",

  // Tower selection
  ARROW_TOWER: "1",
  CANNON_TOWER: "2",
  FROST_TOWER: "3",
  CLEAR_SELECTION: "Escape",

  // Navigation
  MOVE_UP: "ArrowUp",
  MOVE_DOWN: "ArrowDown",
  MOVE_LEFT: "ArrowLeft",
  MOVE_RIGHT: "ArrowRight",

  // Actions
  PLACE_TOWER: "Enter",
  UPGRADE_TOWER: "u",
  OPEN_TOWER_INFO: "i",

  // Targeting
  TARGET_FIRST: "f",
  TARGET_LAST: "l",
  TARGET_NEAREST: "n",
  TARGET_STRONGEST: "t",
  TARGET_WEAKEST: "e",

  // Help
  HELP: "F1",
} as const;
