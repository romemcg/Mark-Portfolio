// Theme palettes. The scene follows the site's own light/dark theme and reads --accent / --blue
// from the page so it always matches the portfolio (blue spectrum, restrained).

export type Palette = {
  dark: boolean;
  wall: string; glassA: string; glassB: string; metal: string; roof: string;
  asphalt: string; walk: string; plaza: string; grass: string; water: string; mark: string;
  fog: string; litWarm: string; litCool: string; litStrength: number;
  sun: string; sunI: number; hemiSky: string; hemiGround: string; hemiI: number; envI: number;
  car: string[]; treeA: string; treeB: string; trunk: string; equip: string;
  additive: boolean; scan: number;
};

export const LIGHT: Palette = {
  dark: false,
  wall: "#e8edf5", glassA: "#58789f", glassB: "#8aaad0", metal: "#4d5c73", roof: "#c4cedd",
  asphalt: "#7f8b9e", walk: "#d2dbe8", plaza: "#dce4ef", grass: "#aec9ab", water: "#93bde3", mark: "#f5f7fb",
  fog: "#eef2f8", litWarm: "#ffe2b0", litCool: "#bcdcff", litStrength: 0.22,
  sun: "#fff4e0", sunI: 2.1, hemiSky: "#dbe9ff", hemiGround: "#8d98aa", hemiI: 0.95, envI: 0.55,
  car: ["#f4f6fa", "#d9dee6", "#aeb6c2", "#4b5563", "#1f2a44", "#3b6fd4", "#e8edf3"],
  treeA: "#86a981", treeB: "#6f966f", trunk: "#6b6258", equip: "#aab4c4",
  additive: false, scan: 0.5,
};

export const DARK: Palette = {
  dark: true,
  wall: "#2b406b", glassA: "#1f4274", glassB: "#34629d", metal: "#1b2a47", roof: "#1d2e4f",
  asphalt: "#0b1527", walk: "#15263f", plaza: "#101e37", grass: "#143a35", water: "#17406b", mark: "#8aa0c4",
  fog: "#070e1c", litWarm: "#ffd9a6", litCool: "#a9d5ff", litStrength: 0.8,
  sun: "#9db9ff", sunI: 0.75, hemiSky: "#4a6fb0", hemiGround: "#0b1428", hemiI: 0.7, envI: 0.3,
  car: ["#cfd7e6", "#8c98ae", "#5d6a85", "#2b3550", "#3a62b8", "#9db6e0", "#e6ecf6"],
  treeA: "#1f5242", treeB: "#2a6a52", trunk: "#2b2a2e", equip: "#2a3b5e",
  additive: true, scan: 0.9,
};

export const isDark = () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";

// "37 99 235" -> [r,g,b] 0..255
export function readVar(name: string, fallback: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return v.length === 3 && v.every((n) => Number.isFinite(n)) ? [v[0], v[1], v[2]] : fallback;
}
