export interface ToolbarItemType {
  id: string;
  name: string;
  shape: "triangle" | "square" | "circle";
  limit: number;
  icon?: string;
  color?: string;
}

export interface PlacedItemType {
  instanceId: string;
  itemId: string;
  position: {
    x: number;
    y: number;
  };
  size: number; // Size in pixels (base: 80, min: 50, max: 200)
}

export interface EditorContextType {
  availableItems: ToolbarItemType[];
  placedItems: PlacedItemType[];
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  addItemToCanvas: (itemId: string, position: { x: number; y: number }) => void;
  getItemCountOnCanvas: (itemId: string) => number;
  updateItemPosition: (instanceId: string, newPosition: { x: number; y: number }) => void;
  updateItemSize: (instanceId: string, newSize: number) => void;
  removeItemFromCanvas: (instanceId: string) => void;
}

// NASA Space Habitat Types
export type FunctionalAreaType =
  | "sleep-quarters"
  | "hygiene-waste"
  | "food-prep"
  | "exercise"
  | "workstation"
  | "stowage"
  | "medical"
  | "recreation"
  | "maintenance"
  | "eclss"
  | "airlock"
  | "common-area"
  | "greenhouse"
  | "lab";

export interface FunctionalAreaRequirements {
  minAreaPerCrew: number; // m² per crew member
  minVolumePerCrew: number; // m³ per crew member
  scalingFactor: number; // How much it scales with mission duration
  required: boolean; // Whether it's mandatory
  adjacentTo: FunctionalAreaType[]; // Areas that should be nearby
  separateFrom: FunctionalAreaType[]; // Areas that should be far away
  icon: string;
  color: string;
  description: string;
}

export interface MissionConfig {
  crewSize: number;
  missionDuration: number; // in days
  destination: "LEO" | "Moon" | "Mars" | "Asteroid" | "Deep Space";
  gravityLevel: "microgravity" | "partial" | "artificial";
  radiationEnvironment: "low" | "moderate" | "high" | "extreme";
}

export interface PlacedFunctionalArea {
  id: string;
  type: FunctionalAreaType;
  position: { x: number; y: number };
  dimensions: { width: number; height: number }; // in meters
  volume: number; // in m³ (for 3D habitats)
  rotation?: number;
}

export interface HabitatDesign {
  id: string;
  name: string;
  mission: MissionConfig;
  areas: PlacedFunctionalArea[];
  totalArea: number; // m²
  totalVolume: number; // m³
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100
}

export interface ValidationError {
  type: "missing" | "undersized" | "conflict" | "adjacency";
  areaType?: FunctionalAreaType;
  message: string;
  severity: "critical" | "major" | "minor";
}

export interface ValidationWarning {
  type: "optimization" | "recommendation";
  message: string;
  areaType?: FunctionalAreaType;
}

export interface MetricCategory {
  name: string;
  score: number; // 0-100
  status: "pass" | "warning" | "fail";
  details: string[];
}

// Additional types for habitat designer
export type Destination = "lunar-surface" | "mars-surface" | "deep-space" | "leo";
export type LaunchVehicle = "falcon-heavy" | "sls" | "starship" | "custom";
export type HabitatType = "metallic" | "inflatable" | "in-situ";
export type HabitatShape = "cylindrical" | "spherical" | "toroidal" | "modular";

export interface HabitatConfig {
  shape: HabitatShape;
  type: HabitatType;
  dimensions: {
    width: number;
    height: number;
  };
  volume: number;
  levels: number;
}

export interface MissionConfigWizard {
  crewSize: number;
  durationDays: number;
  destination: Destination;
  launchVehicle: LaunchVehicle;
}

// Placed Zone for canvas
export interface PlacedZone {
  instanceId: string;
  zoneType: FunctionalAreaType;
  position: { x: number; y: number };
  dimensions: { width: number; height: number }; // in pixels
  areaM2: number; // calculated area in m²
}

// Validation Issue
export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  affectedZoneId?: string;
}

// Extended validation result
export interface ExtendedValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  missingRequiredAreas: FunctionalAreaType[];
  totalArea: number;
  totalVolume: number;
}
