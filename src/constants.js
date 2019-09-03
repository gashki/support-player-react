import React from "react";
import * as SvgWeapons from "./components/Weapons";

export const NADE_LIMIT = 30;

export const sortObject = (object, sortType = 0) => {
  const objectKeys = Object.keys(object);

  // An array of objects with all of their properties
  const objectSort = objectKeys.map(key => ({ id: key, ...object[key] }));

  switch (sortType) {
    case 0:
      // Sorts the objects by the title
      objectSort.sort((a, b) => (a.title > b.title) - (a.title < b.title));
      break;
    case 1:
      // Sorts the objects by the sort value
      objectSort.sort((a, b) => a.sort - b.sort);
      break;
    default:
  }

  return objectSort;
};

// Do not change the sort values
export const MAPS = {
  "de_cache": {
    title: "Cache",
    sort: 0
  },
  "de_cbble": {
    title: "Cobblestone",
    sort: 1
  },
  "de_dust2": {
    title: "Dust II",
    sort: 2
  },
  "de_inferno": {
    title: "Inferno",
    sort: 3
  },
  "de_mirage": {
    title: "Mirage",
    sort: 4
  },
  "de_nuke": {
    title: "Nuke",
    sort: 5
  },
  "de_overpass": {
    title: "Overpass",
    sort: 6
  },
  "de_train": {
    title: "Train",
    sort: 7
  },
  "de_vertigo": {
    title: "Vertigo",
    sort: 8
  }
};

// Do not change the sort values
export const NADES = {
  "weapon_firegrenade": {
    title: "Incendiary/Molotov",
    icon: {
      "weapon_incgrenade": <SvgWeapons.IncGrenade />,
      "weapon_molotov": <SvgWeapons.Molotov />,
    },
    verb: "fire",
    sort: 1
  },
  "weapon_flashbang": {
    title: "Flashbang",
    icon: <SvgWeapons.Flashbang />,
    verb: "flash",
    sort: 2
  },
  "weapon_hegrenade": {
    title: "HE Grenade",
    icon: <SvgWeapons.HEGrenade />,
    verb: "explode at",
    sort: 3
  },
  "weapon_smokegrenade": {
    title: "Smoke Grenade",
    icon: <SvgWeapons.SmokeGrenade />,
    verb: "smoke",
    sort: 0
  }
};

export const FILTERS = {
  movement: [
    { id: "fixed", title: "Stationary" },
    { id: "jump", title: "Run/Walk" },
    { id: "walk", title: "Jump" }
  ],
  rating: [
    { id: "4-star", title: "80" },
    { id: "3-star", title: "60" },
    { id: "2-star", title: "40" },
    { id: "1-star", title: "20" }
  ],
  feature: [
    { id: "oneway", title: "One-way" }
  ],
  tickrate: [
    { id: "64", title: "64 Tick" },
    { id: "128", title: "128 Tick" }
  ],
  team: [
    { id: "counter-terrorist", title: "Counter-Terrorist" },
    { id: "terrorist", title: "Terrorist" }
  ]
};