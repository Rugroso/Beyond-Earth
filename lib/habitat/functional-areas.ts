import type { FunctionalAreaRequirements, FunctionalAreaType } from "@/types";


/**
 * NASA Space Habitat Functional Area Requirements
 * Based on NASA standards for crew habitat design
 * Requirements scale with crew size and mission duration
 */
export const FUNCTIONAL_AREA_REQUIREMENTS: Record<FunctionalAreaType, FunctionalAreaRequirements> = {
  "sleep-quarters": {
    minAreaPerCrew: 3.5, // m² per crew member (NASA standard: ~3-4 m²)
    minVolumePerCrew: 10.5, // m³ per crew member
    scalingFactor: 1.0, // doesn't scale much with duration
    required: true,
    adjacentTo: ["common-area"],
    separateFrom: ["exercise", "food-prep", "maintenance", "airlock"],
    icon: "🛏️",
    color: "#4A5568",
    description: "Private sleeping quarters for crew rest and privacy. Should be quiet and isolated from noisy areas."
  },
  "hygiene-waste": {
    minAreaPerCrew: 2.0, // m² per crew
    minVolumePerCrew: 6.0, // m³ per crew
    scalingFactor: 0.8,
    required: true,
    adjacentTo: ["sleep-quarters"],
    separateFrom: ["food-prep", "medical", "workstation"],
    icon: "🚽",
    color: "#63B3ED",
    description: "Waste management, shower, and personal hygiene facilities. Must be separate from food areas."
  },
  "food-prep": {
    minAreaPerCrew: 1.5, // m² per crew
    minVolumePerCrew: 4.5, // m³ per crew
    scalingFactor: 1.2, // needs more space for longer missions
    required: true,
    adjacentTo: ["stowage", "common-area"],
    separateFrom: ["hygiene-waste", "exercise", "maintenance"],
    icon: "🍽️",
    color: "#F6AD55",
    description: "Food preparation, cooking, and meal assembly area. Includes galley and dining space."
  },
  "exercise": {
    minAreaPerCrew: 2.5, // m² per crew
    minVolumePerCrew: 8.0, // m³ per crew (needs ceiling height)
    scalingFactor: 1.0,
    required: true,
    adjacentTo: ["medical"],
    separateFrom: ["sleep-quarters", "workstation", "food-prep"],
    icon: "💪",
    color: "#F56565",
    description: "Exercise equipment area. Critical for maintaining crew health in microgravity. Can be noisy."
  },
  "workstation": {
    minAreaPerCrew: 2.0, // m² per crew
    minVolumePerCrew: 6.0, // m³ per crew
    scalingFactor: 1.1,
    required: true,
    adjacentTo: ["common-area", "medical"],
    separateFrom: ["exercise"],
    icon: "🖥️",
    color: "#805AD5",
    description: "Computer workstations, science operations, and mission control interface."
  },
  "stowage": {
    minAreaPerCrew: 3.0, // m² per crew (significant storage needed)
    minVolumePerCrew: 9.0, // m³ per crew
    scalingFactor: 1.5, // scales significantly with mission duration
    required: true,
    adjacentTo: ["food-prep", "maintenance"],
    separateFrom: [],
    icon: "📦",
    color: "#A0AEC0",
    description: "Storage for supplies, equipment, spare parts, and mission cargo. Needs good organization."
  },
  "medical": {
    minAreaPerCrew: 1.0, // m² (doesn't scale linearly)
    minVolumePerCrew: 3.0, // m³
    scalingFactor: 0.6,
    required: true,
    adjacentTo: ["workstation", "exercise"],
    separateFrom: ["hygiene-waste", "maintenance"],
    icon: "🏥",
    color: "#FC8181",
    description: "Medical bay with examination area, medical supplies, and emergency equipment."
  },
  "recreation": {
    minAreaPerCrew: 1.5, // m² per crew
    minVolumePerCrew: 4.5, // m³ per crew
    scalingFactor: 1.2, // more important for longer missions
    required: false,
    adjacentTo: ["common-area", "sleep-quarters"],
    separateFrom: ["maintenance", "airlock"],
    icon: "🎮",
    color: "#9F7AEA",
    description: "Recreation and leisure area for crew morale. Games, entertainment, communication with Earth."
  },
  "maintenance": {
    minAreaPerCrew: 1.5, // m² per crew
    minVolumePerCrew: 5.0, // m³ per crew
    scalingFactor: 1.0,
    required: true,
    adjacentTo: ["stowage", "eclss", "airlock"],
    separateFrom: ["food-prep", "medical", "sleep-quarters"],
    icon: "🔧",
    color: "#ECC94B",
    description: "Repair and maintenance workshop. Tools, spare parts, and workspace for habitat upkeep."
  },
  "eclss": {
    minAreaPerCrew: 1.0, // m² (system-based, not per-crew)
    minVolumePerCrew: 3.5, // m³
    scalingFactor: 0.8,
    required: true,
    adjacentTo: ["maintenance"],
    separateFrom: ["sleep-quarters", "food-prep"],
    icon: "⚙️",
    color: "#4299E1",
    description: "Environmental Control & Life Support Systems. Air, water, temperature management. Can be noisy."
  },
  "airlock": {
    minAreaPerCrew: 0.5, // m² (1-2 airlocks typically)
    minVolumePerCrew: 2.0, // m³
    scalingFactor: 0.3,
    required: true,
    adjacentTo: ["maintenance", "stowage"],
    separateFrom: ["food-prep", "medical"],
    icon: "🚪",
    color: "#718096",
    description: "Pressurized airlock for EVA operations. Stores spacesuits and EVA equipment."
  },
  "plant-growth": {
    minAreaPerCrew: 1.0, // m² per crew (optional, for long missions)
    minVolumePerCrew: 3.0, // m³ per crew
    scalingFactor: 1.3,
    required: false,
    adjacentTo: ["food-prep", "workstation"],
    separateFrom: ["hygiene-waste"],
    icon: "🌱",
    color: "#48BB78",
    description: "Plant growth facility for fresh food and psychological benefits. Optional but valuable for long missions."
  },
  "common-area": {
    minAreaPerCrew: 2.5, // m² per crew
    minVolumePerCrew: 8.0, // m³ per crew
    scalingFactor: 1.1,
    required: true,
    adjacentTo: ["food-prep", "recreation", "workstation"],
    separateFrom: ["maintenance", "eclss"],
    icon: "👥",
    color: "#38B2AC",
    description: "Central gathering space for crew meetings, meals, and social interaction. Hub of habitat life."
  }
};

/**
 * Get minimum required area for a functional area based on crew size and duration
 */
export function getMinimumArea(
  areaType: FunctionalAreaType,
  crewSize: number,
  durationDays: number
): number {
  const requirements = FUNCTIONAL_AREA_REQUIREMENTS[areaType];
  const baseArea = requirements.minAreaPerCrew * crewSize;
  
  // Scale area based on mission duration (longer missions need more space)
  // Duration scaling: 1-30 days (1.0x), 31-180 days (1.1x), 181-365 days (1.2x), 365+ days (1.3x)
  let durationMultiplier = 1.0;
  if (durationDays > 365) durationMultiplier = 1.3;
  else if (durationDays > 180) durationMultiplier = 1.2;
  else if (durationDays > 30) durationMultiplier = 1.1;
  
  return baseArea * durationMultiplier * requirements.scalingFactor;
}

/**
 * Get minimum required volume for a functional area
 */
export function getMinimumVolume(
  areaType: FunctionalAreaType,
  crewSize: number,
  durationDays: number
): number {
  const requirements = FUNCTIONAL_AREA_REQUIREMENTS[areaType];
  const baseVolume = requirements.minVolumePerCrew * crewSize;
  
  let durationMultiplier = 1.0;
  if (durationDays > 365) durationMultiplier = 1.3;
  else if (durationDays > 180) durationMultiplier = 1.2;
  else if (durationDays > 30) durationMultiplier = 1.1;
  
  return baseVolume * durationMultiplier * requirements.scalingFactor;
}

/**
 * Check if two areas should be adjacent (best practice)
 */
export function shouldBeAdjacent(area1: FunctionalAreaType, area2: FunctionalAreaType): boolean {
  const req1 = FUNCTIONAL_AREA_REQUIREMENTS[area1];
  const req2 = FUNCTIONAL_AREA_REQUIREMENTS[area2];
  
  return (
    req1.adjacentTo?.includes(area2) || 
    req2.adjacentTo?.includes(area1) ||
    false
  );
}

/**
 * Check if two areas should be separated (best practice)
 */
export function shouldBeSeparated(area1: FunctionalAreaType, area2: FunctionalAreaType): boolean {
  const req1 = FUNCTIONAL_AREA_REQUIREMENTS[area1];
  const req2 = FUNCTIONAL_AREA_REQUIREMENTS[area2];
  
  return (
    req1.separateFrom?.includes(area2) || 
    req2.separateFrom?.includes(area1) ||
    false
  );
}

/**
 * Get all required functional areas for a mission
 */
export function getRequiredAreas(): FunctionalAreaType[] {
  return Object.entries(FUNCTIONAL_AREA_REQUIREMENTS)
    .filter(([_, req]) => req.required)
    .map(([type, _]) => type as FunctionalAreaType);
}

/**
 * Get all optional functional areas
 */
export function getOptionalAreas(): FunctionalAreaType[] {
  return Object.entries(FUNCTIONAL_AREA_REQUIREMENTS)
    .filter(([_, req]) => !req.required)
    .map(([type, _]) => type as FunctionalAreaType);
}
