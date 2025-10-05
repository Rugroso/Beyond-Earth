export type Destination = 'moon' | 'mars'
export type CanvasSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface SetupConfig {
  destination: Destination | null
  duration: number | null // days
  crewSize: number | null
  canvasSize: CanvasSize | null
}

export interface CanvasDimensions {
  width: number
  height: number
}

export const CANVAS_SIZES: Record<CanvasSize, CanvasDimensions> = {
  small: { width: 800, height: 600 },
  medium: { width: 1200, height: 800 },
  large: { width: 1600, height: 1000 },
  xlarge: { width: 2000, height: 1200 }
}

// Constraints por item
export interface ItemConstraint {
  itemId: string
  itemName: string
  min: number // Mínimo requerido
  max: number // Máximo permitido
  required: boolean // Si es obligatorio tenerlo
  reason: string // Razón del constraint
}

export interface LayoutConstraints {
  items: ItemConstraint[]
  totalMinItems: number
  totalMaxItems: number
  recommendations: string[]
}