import type { ObjectType, FunctionalAreaType } from "@/types";

export interface ObjectDefinition {
  id: ObjectType;
  name: string;
  width: number; // meters
  height: number; // meters
  icon: string;
  assetPath?: string; // Path to custom asset image if uploaded
  category: "furniture" | "equipment" | "system" | "storage";
  description: string;
  suitableFor: FunctionalAreaType[];
  required?: boolean;
  color: string;
}

/**
 * NASA-compliant habitat objects library
 * Icons are emojis by default, but can be replaced with custom assets
 */
export const OBJECT_DEFINITIONS: Record<ObjectType, ObjectDefinition> = {
  // FURNITURE
  bed: {
    id: "bed",
    name: "Cama Individual",
    width: 0.8,
    height: 2.0,
    icon: "🛏️",
    category: "furniture",
    description: "Cama con sujeciones para microgravedad",
    suitableFor: ["sleep-quarters"],
    required: true,
    color: "#4A5568"
  },
  chair: {
    id: "chair",
    name: "Silla",
    width: 0.6,
    height: 0.6,
    icon: "🪑",
    category: "furniture",
    description: "Silla ergonómica",
    suitableFor: ["workstation", "common-area", "food-prep", "medical"],
    color: "#805AD5"
  },
  desk: {
    id: "desk",
    name: "Escritorio",
    width: 1.2,
    height: 0.8,
    icon: "🖥️",
    category: "furniture",
    description: "Estación de trabajo con pantallas",
    suitableFor: ["workstation", "medical"],
    required: true,
    color: "#805AD5"
  },
  table: {
    id: "table",
    name: "Mesa",
    width: 1.5,
    height: 1.0,
    icon: "🪑",
    category: "furniture",
    description: "Mesa multipropósito",
    suitableFor: ["common-area", "food-prep", "recreation"],
    color: "#38B2AC"
  },
  sofa: {
    id: "sofa",
    name: "Sofá",
    width: 2.0,
    height: 0.9,
    icon: "🛋️",
    category: "furniture",
    description: "Sofá para área común",
    suitableFor: ["common-area", "recreation"],
    color: "#38B2AC"
  },
  bookshelf: {
    id: "bookshelf",
    name: "Estantería",
    width: 1.0,
    height: 2.0,
    icon: "📚",
    category: "furniture",
    description: "Estantería para libros y objetos personales",
    suitableFor: ["common-area", "sleep-quarters", "workstation"],
    color: "#A0AEC0"
  },

  // EQUIPMENT
  treadmill: {
    id: "treadmill",
    name: "Caminadora",
    width: 0.9,
    height: 2.0,
    icon: "🏃",
    category: "equipment",
    description: "Caminadora con arnés para ejercicio cardiovascular",
    suitableFor: ["exercise"],
    required: true,
    color: "#F56565"
  },
  bike: {
    id: "bike",
    name: "Bicicleta Estática",
    width: 0.6,
    height: 1.2,
    icon: "🚴",
    category: "equipment",
    description: "Bicicleta estática para ejercicio",
    suitableFor: ["exercise"],
    color: "#F56565"
  },
  weights: {
    id: "weights",
    name: "Zona de Pesas",
    width: 1.5,
    height: 1.5,
    icon: "🏋️",
    category: "equipment",
    description: "Área con pesas y resistencia",
    suitableFor: ["exercise"],
    color: "#F56565"
  },
  "equipment-rack": {
    id: "equipment-rack",
    name: "Rack de Equipos",
    width: 0.6,
    height: 2.0,
    icon: "📊",
    category: "equipment",
    description: "Rack estándar para sistemas e instrumentos",
    suitableFor: ["eclss", "maintenance", "workstation", "medical"],
    color: "#4299E1"
  },
  "control-panel": {
    id: "control-panel",
    name: "Panel de Control",
    width: 1.0,
    height: 0.5,
    icon: "🎛️",
    category: "equipment",
    description: "Panel de control y monitoreo del habitat",
    suitableFor: ["eclss", "workstation", "maintenance"],
    required: true,
    color: "#4299E1"
  },
  "plant-module": {
    id: "plant-module",
    name: "Módulo de Plantas",
    width: 1.0,
    height: 1.5,
    icon: "🌱",
    category: "equipment",
    description: "Sistema hidropónico para cultivo",
    suitableFor: ["plant-growth"],
    color: "#48BB78"
  },
  microscope: {
    id: "microscope",
    name: "Microscopio",
    width: 0.5,
    height: 0.6,
    icon: "🔬",
    category: "equipment",
    description: "Microscopio para investigación",
    suitableFor: ["medical", "workstation"],
    color: "#FC8181"
  },
  monitor: {
    id: "monitor",
    name: "Monitor Grande",
    width: 1.0,
    height: 0.6,
    icon: "🖥️",
    category: "equipment",
    description: "Pantalla grande para trabajo y comunicaciones",
    suitableFor: ["workstation", "common-area", "medical"],
    color: "#805AD5"
  },
  "3d-printer": {
    id: "3d-printer",
    name: "Impresora 3D",
    width: 0.8,
    height: 1.0,
    icon: "🖨️",
    category: "equipment",
    description: "Impresora 3D para fabricación de piezas",
    suitableFor: ["maintenance", "workstation"],
    color: "#ECC94B"
  },

  // STORAGE
  "storage-locker": {
    id: "storage-locker",
    name: "Locker Personal",
    width: 0.8,
    height: 1.2,
    icon: "🗄️",
    category: "storage",
    description: "Locker personal para pertenencias",
    suitableFor: ["sleep-quarters", "stowage", "airlock"],
    required: true,
    color: "#A0AEC0"
  },
  cabinet: {
    id: "cabinet",
    name: "Gabinete",
    width: 1.0,
    height: 1.5,
    icon: "🗄️",
    category: "storage",
    description: "Gabinete de almacenamiento",
    suitableFor: ["food-prep", "medical", "stowage"],
    color: "#A0AEC0"
  },
  toolbox: {
    id: "toolbox",
    name: "Caja de Herramientas",
    width: 0.6,
    height: 0.4,
    icon: "🧰",
    category: "storage",
    description: "Caja con herramientas de mantenimiento",
    suitableFor: ["maintenance", "airlock"],
    color: "#ECC94B"
  },
  "supply-crate": {
    id: "supply-crate",
    name: "Caja de Suministros",
    width: 1.0,
    height: 1.0,
    icon: "📦",
    category: "storage",
    description: "Caja grande para suministros",
    suitableFor: ["stowage"],
    color: "#A0AEC0"
  },

  // HYGIENE & SYSTEMS
  toilet: {
    id: "toilet",
    name: "Inodoro Espacial",
    width: 0.7,
    height: 0.8,
    icon: "🚽",
    category: "system",
    description: "Sistema de gestión de desechos",
    suitableFor: ["hygiene-waste"],
    required: true,
    color: "#63B3ED"
  },
  shower: {
    id: "shower",
    name: "Ducha",
    width: 1.0,
    height: 1.0,
    icon: "🚿",
    category: "system",
    description: "Cabina de ducha con reciclaje de agua",
    suitableFor: ["hygiene-waste"],
    required: true,
    color: "#63B3ED"
  },
  sink: {
    id: "sink",
    name: "Lavabo",
    width: 0.6,
    height: 0.5,
    icon: "🚰",
    category: "system",
    description: "Lavabo con sistema de agua",
    suitableFor: ["hygiene-waste", "food-prep", "medical"],
    color: "#63B3ED"
  },

  // FOOD PREP
  galley: {
    id: "galley",
    name: "Cocina/Galley",
    width: 1.5,
    height: 1.0,
    icon: "🍳",
    category: "equipment",
    description: "Estación de preparación y calentamiento de comida",
    suitableFor: ["food-prep"],
    required: true,
    color: "#F6AD55"
  },
  refrigerator: {
    id: "refrigerator",
    name: "Refrigerador",
    width: 0.7,
    height: 1.5,
    icon: "❄️",
    category: "equipment",
    description: "Refrigerador para almacenamiento de alimentos",
    suitableFor: ["food-prep"],
    color: "#F6AD55"
  },
  "water-dispenser": {
    id: "water-dispenser",
    name: "Dispensador de Agua",
    width: 0.4,
    height: 1.2,
    icon: "💧",
    category: "system",
    description: "Dispensador de agua potable",
    suitableFor: ["food-prep", "common-area", "exercise"],
    color: "#63B3ED"
  },

  // RECREATION
  tv: {
    id: "tv",
    name: "Pantalla de Entretenimiento",
    width: 1.5,
    height: 0.9,
    icon: "📺",
    category: "equipment",
    description: "Pantalla grande para películas y comunicaciones",
    suitableFor: ["recreation", "common-area"],
    color: "#9F7AEA"
  },
  "gaming-console": {
    id: "gaming-console",
    name: "Consola de Juegos",
    width: 0.4,
    height: 0.3,
    icon: "🎮",
    category: "equipment",
    description: "Consola de videojuegos para recreación",
    suitableFor: ["recreation"],
    color: "#9F7AEA"
  },
  guitar: {
    id: "guitar",
    name: "Instrumento Musical",
    width: 0.4,
    height: 1.0,
    icon: "🎸",
    category: "equipment",
    description: "Instrumento musical para recreación",
    suitableFor: ["recreation", "common-area"],
    color: "#9F7AEA"
  },

  // MEDICAL
  "medical-bed": {
    id: "medical-bed",
    name: "Camilla Médica",
    width: 0.9,
    height: 2.0,
    icon: "🏥",
    category: "equipment",
    description: "Camilla para exámenes médicos",
    suitableFor: ["medical"],
    required: true,
    color: "#FC8181"
  },
  "medical-cabinet": {
    id: "medical-cabinet",
    name: "Botiquín Médico",
    width: 0.8,
    height: 1.5,
    icon: "💊",
    category: "storage",
    description: "Gabinete con suministros médicos",
    suitableFor: ["medical"],
    required: true,
    color: "#FC8181"
  },

  // AIRLOCK
  spacesuit: {
    id: "spacesuit",
    name: "Traje Espacial",
    width: 0.6,
    height: 1.8,
    icon: "👨‍🚀",
    category: "equipment",
    description: "Traje espacial para EVA",
    suitableFor: ["airlock"],
    required: true,
    color: "#718096"
  },
  "airlock-door": {
    id: "airlock-door",
    name: "Puerta de Airlock",
    width: 1.0,
    height: 2.0,
    icon: "🚪",
    category: "system",
    description: "Puerta presurizada del airlock",
    suitableFor: ["airlock"],
    required: true,
    color: "#718096"
  }
};

/**
 * Check if an object has a custom asset uploaded
 */
export function hasCustomAsset(objectType: ObjectType): boolean {
  const def = OBJECT_DEFINITIONS[objectType];
  return !!(def && def.assetPath && def.assetPath.length > 0);
}

/**
 * Get the display icon/image for an object
 * Returns emoji by default, or asset path if uploaded
 */
export function getObjectDisplay(objectType: ObjectType): { type: "emoji" | "image"; value: string } {
  const def = OBJECT_DEFINITIONS[objectType];
  if (!def) return { type: "emoji", value: "❓" };

  if (hasCustomAsset(objectType)) {
    return { type: "image", value: def.assetPath! };
  }

  return { type: "emoji", value: def.icon };
}

/**
 * Set custom asset for an object type
 */
export function setObjectAsset(objectType: ObjectType, assetPath: string): void {
  if (OBJECT_DEFINITIONS[objectType]) {
    OBJECT_DEFINITIONS[objectType].assetPath = assetPath;
  }
}

/**
 * Get all objects suitable for a specific functional area
 */
export function getObjectsForArea(areaType: FunctionalAreaType): ObjectDefinition[] {
  return Object.values(OBJECT_DEFINITIONS).filter((obj) => obj.suitableFor.includes(areaType));
}

/**
 * Get required objects for a specific functional area
 */
export function getRequiredObjectsForArea(areaType: FunctionalAreaType): ObjectDefinition[] {
  return Object.values(OBJECT_DEFINITIONS).filter((obj) => obj.required && obj.suitableFor.includes(areaType));
}

/**
 * Check if an area has all required objects
 */
export function hasRequiredObjects(
  areaType: FunctionalAreaType,
  placedObjects: Array<{ objectType: ObjectType }>
): { valid: boolean; missing: ObjectType[] } {
  const required = getRequiredObjectsForArea(areaType);
  const missing: ObjectType[] = [];

  for (const reqObj of required) {
    const hasObject = placedObjects.some((obj) => obj.objectType === reqObj.id);
    if (!hasObject) {
      missing.push(reqObj.id);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Get object definition by type
 */
export function getObjectDefinition(objectType: ObjectType): ObjectDefinition | undefined {
  return OBJECT_DEFINITIONS[objectType];
}
