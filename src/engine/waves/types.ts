import type { Mob } from "../mobs/types";

export type Wave = {
  id: number;
  entries: WaveEntry[];
};

export type WaveEntry = {
  delay: number; // seconds from wave start
  mobType: Mob["type"];
  count: number;
  spacing: number; // seconds between spawns
};
