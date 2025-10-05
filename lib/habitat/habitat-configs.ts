import type { HabitatShape, HabitatType, LaunchVehicle } from "@/types";

/**

 * Launch Vehicle Payload Fairing Specifications
 * Based on real NASA and commercial launch vehicles
 */
export const LAUNCH_VEHICLES = {
  "falcon-heavy": {
    name: "SpaceX Falcon Heavy",
    maxDiameter: 5.2, // meters
    maxHeight: 13.1, // meters
    maxPayloadMass: 63800, // kg to LEO
    description: "SpaceX's heavy-lift launch vehicle"
  },
  "sls": {
    name: "NASA Space Launch System (Block 1)",
    maxDiameter: 5.0, // meters
    maxHeight: 27.4, // meters (longer fairing)
    maxPayloadMass: 95000, // kg to LEO
    description: "NASA's super heavy-lift launch system for Artemis missions"
  },
  "starship": {
    name: "SpaceX Starship",
    maxDiameter: 9.0, // meters (much larger!)
    maxHeight: 17.0, // meters usable
    maxPayloadMass: 100000, // kg to LEO
    description: "Next-generation fully reusable launch system"
  },
  "custom": {
    name: "Custom Configuration",
    maxDiameter: 10.0, // meters
    maxHeight: 20.0, // meters
    maxPayloadMass: 150000, // kg
    description: "Custom habitat dimensions"
  }
} as const;

/**
 * Habitat Shape Templates
 * Pre-configured dimensions for different habitat shapes
 */
export const HABITAT_SHAPE_TEMPLATES = {
  cylindrical: {
    name: "Cylindrical Habitat",
    description: "Traditional cylindrical design, efficient for launch and pressurization",
    defaultDimensions: {
      width: 4.5, // diameter in meters
      height: 10.0, // length in meters
    },
    volumeFormula: (w: number, h: number) => Math.PI * Math.pow(w / 2, 2) * h,
    icon: "🛢️",
    advantages: ["Efficient pressurization", "Easy to manufacture", "Good for launch vehicles"],
    disadvantages: ["Less flexible interior layout"]
  },
  spherical: {
    name: "Spherical Habitat",
    description: "Optimal pressure vessel, maximum volume for surface area",
    defaultDimensions: {
      width: 8.0, // diameter in meters
      height: 8.0, // diameter in meters
    },
    volumeFormula: (w: number) => (4 / 3) * Math.PI * Math.pow(w / 2, 3),
    icon: "⚪",
    advantages: ["Optimal pressure distribution", "Maximum volume efficiency", "No stress concentrations"],
    disadvantages: ["Difficult to partition", "Challenging to launch (large diameter)"]
  },
  toroidal: {
    name: "Toroidal (Donut) Habitat",
    description: "Ring-shaped habitat, can provide artificial gravity through rotation",
    defaultDimensions: {
      width: 20.0, // major diameter (ring diameter) in meters
      height: 4.0, // minor diameter (tube diameter) in meters
      depth: 4.0, // tube thickness
    },
    volumeFormula: (w: number, h: number) => 2 * Math.PI * Math.PI * (w / 2) * Math.pow(h / 2, 2),
    icon: "🍩",
    advantages: ["Can provide artificial gravity", "Good for long-duration missions", "Interesting interior spaces"],
    disadvantages: ["Complex construction", "Must be assembled in space", "Large scale required"]
  },
  modular: {
    name: "Modular Habitat",
    description: "Multiple connected modules, expandable and flexible",
    defaultDimensions: {
      width: 4.0, // module diameter
      height: 6.0, // module length
      depth: 3, // number of modules
    },
    volumeFormula: (w: number, h: number, d?: number) => {
      const modules = d || 3;
      return modules * Math.PI * Math.pow(w / 2, 2) * h;
    },
    icon: "🔗",
    advantages: ["Expandable", "Redundancy", "Flexible configuration", "Can be launched separately"],
    disadvantages: ["Complex connections", "More potential leak points", "Requires assembly"]
  }
} as const;

/**
 * Habitat Type Characteristics
 */
export const HABITAT_TYPES = {
  metallic: {
    name: "Metallic Habitat",
    description: "Traditional metal structure, launched fully assembled",
    constructionTime: "Pre-built on Earth",
    advantages: [
      "Proven technology",
      "High structural strength",
      "Ready to use on arrival",
      "Good radiation shielding"
    ],
    disadvantages: [
      "Heavy (high launch cost)",
      "Limited by launch vehicle size",
      "Fixed size"
    ],
    icon: "🔩",
    color: "#A0AEC0"
  },
  inflatable: {
    name: "Inflatable Habitat",
    description: "Soft-goods structure, launched compact and inflated on-site",
    constructionTime: "Hours to inflate and pressurize",
    advantages: [
      "Lightweight",
      "Large volume in small launch package",
      "More flexible interior space",
      "Lower launch costs"
    ],
    disadvantages: [
      "Newer technology",
      "Concerns about micrometeorite protection",
      "Requires careful inflation",
      "May need internal structure"
    ],
    icon: "🎈",
    color: "#ED8936"
  },
  "in-situ": {
    name: "In-Situ Resource Utilization (ISRU)",
    description: "Built on location using local materials (regolith, 3D printing)",
    constructionTime: "Weeks to months",
    advantages: [
      "Uses local materials",
      "Excellent radiation protection",
      "Can be very large",
      "Minimal launch mass"
    ],
    disadvantages: [
      "Requires robotic construction",
      "Long setup time",
      "Technology still in development",
      "Depends on local resources"
    ],
    icon: "🏗️",
    color: "#D69E2E"
  }
} as const;

/**
 * Destination-specific considerations
 */
export const DESTINATIONS = {
  "lunar-surface": {
    name: "Lunar Surface",
    gravity: 0.16, // g (Earth = 1.0)
    radiation: "High (no atmosphere)",
    temperature: "Extreme (-173°C to 127°C)",
    considerations: [
      "Regolith coverage for radiation protection",
      "Micrometeorite protection needed",
      "Thermal control critical",
      "Dust management essential"
    ],
    icon: "🌙"
  },
  "mars-surface": {
    name: "Mars Surface",
    gravity: 0.38, // g
    radiation: "Moderate (thin atmosphere)",
    temperature: "Cold (-125°C to 20°C)",
    considerations: [
      "Dust storm protection",
      "CO2 atmosphere (can be used for ISRU)",
      "Partial radiation protection from atmosphere",
      "Longer mission durations"
    ],
    icon: "🔴"
  },
  "deep-space": {
    name: "Deep Space",
    gravity: 0.0, // microgravity
    radiation: "Very High (no protection)",
    temperature: "Extreme cold (radiative only)",
    considerations: [
      "Maximum radiation shielding needed",
      "Artificial gravity may be required",
      "Complete life support isolation",
      "Psychological considerations (isolation)"
    ],
    icon: "🌌"
  },
  "transit": {
    name: "Transit Vehicle",
    gravity: 0.0, // microgravity (unless rotating)
    radiation: "High",
    temperature: "Controlled",
    considerations: [
      "Compact efficient design",
      "Long-duration life support",
      "Exercise equipment critical",
      "Entertainment and communication vital"
    ],
    icon: "🚀"
  }
} as const;

/**
 * Calculate maximum habitat dimensions based on launch vehicle
 */
export function getMaxDimensions(launchVehicle: LaunchVehicle, shape: HabitatShape) {
  const vehicle = LAUNCH_VEHICLES[launchVehicle];
  const template = HABITAT_SHAPE_TEMPLATES[shape];
  
  // For most shapes, limit by vehicle diameter and height
  let maxWidth = vehicle.maxDiameter * 0.9; // 90% of max for safety margin
  let maxHeight = vehicle.maxHeight * 0.9;
  
  // Special cases for inflatable (can be larger when deployed)
  // and in-situ (built on site, not limited by launch vehicle)
  
  return {
    maxWidth,
    maxHeight,
    recommended: template.defaultDimensions
  };
}

/**
 * Calculate habitat volume based on shape and dimensions
 */
export function calculateVolume(
  shape: HabitatShape,
  width: number,
  height: number,
  depth?: number
): number {
  const template = HABITAT_SHAPE_TEMPLATES[shape];
  return template.volumeFormula(width, height, depth);
}

/**
 * Validate habitat dimensions against launch vehicle constraints
 */
export function validateDimensions(
  launchVehicle: LaunchVehicle,
  habitatType: HabitatType,
  shape: HabitatShape,
  width: number,
  height: number
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Inflatable and ISRU habitats are not limited by launch vehicle fairing
  if (habitatType === "inflatable" || habitatType === "in-situ") {
    return { valid: true, warnings: [] };
  }
  
  const vehicle = LAUNCH_VEHICLES[launchVehicle];
  
  if (width > vehicle.maxDiameter) {
    warnings.push(
      `Habitat diameter (${width.toFixed(1)}m) exceeds ${vehicle.name} fairing diameter (${vehicle.maxDiameter}m)`
    );
  }
  
  if (height > vehicle.maxHeight) {
    warnings.push(
      `Habitat height (${height.toFixed(1)}m) exceeds ${vehicle.name} fairing height (${vehicle.maxHeight}m)`
    );
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}

/**
 * Get recommended crew size based on habitat volume
 * NASA guideline: ~25-50 m³ per crew member for long-duration missions
 */
export function getRecommendedCrewSize(volume: number, durationDays: number): {
  min: number;
  max: number;
  recommended: number;
} {
  // Volume per crew scales with mission duration
  let volumePerCrew = 25; // m³ base
  
  if (durationDays > 365) volumePerCrew = 50; // long missions need more space
  else if (durationDays > 180) volumePerCrew = 40;
  else if (durationDays > 90) volumePerCrew = 30;
  
  const recommended = Math.floor(volume / volumePerCrew);
  const min = Math.max(1, Math.floor(volume / 60)); // absolute minimum
  const max = Math.min(6, Math.ceil(volume / 20)); // practical maximum
  
  return {
    min,
    max,
    recommended: Math.max(1, Math.min(recommended, 6))
  };
}
