import React from "react";
import * as SvgWeapons from "./components/Weapons";

export const MAPS = {
  "de_cache": "Cache",
  "de_cbble": "Cobblestone",
  "de_dust2": "Dust II",
  "de_inferno": "Inferno",
  "de_mirage": "Mirage",
  "de_nuke": "Nuke",
  "de_overpass": "Overpass",
  "de_train": "Train"
};

export const NADES = {
  "weapon_flashbang": <SvgWeapons.Flashbang />,
  "weapon_hegrenade": <SvgWeapons.HEGrenade />,
  "weapon_incgrenade": <SvgWeapons.IncGrenade />,
  "weapon_molotov": <SvgWeapons.Molotov />,
  "weapon_smokegrenade": <SvgWeapons.SmokeGrenade />
};
