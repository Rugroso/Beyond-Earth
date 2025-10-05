import type { SetupConfig, LayoutConstraints, ItemConstraint } from '@/types/setup'

/**
 * Genera constraints basados en la configuración del setup
 */
export function generateConstraints(setup: SetupConfig): LayoutConstraints {
  const { destination, duration, crewSize, canvasSize } = setup
  
  if (!destination || !duration || !crewSize || !canvasSize) {
    throw new Error('Setup incompleto')
  }

  const constraints: ItemConstraint[] = []
  const recommendations: string[] = []

  // BASICS OBLIGATORIOS (siempre necesarios)
  
  // Camas - 1 por persona
  constraints.push({
    itemId: 'item-007',
    itemName: 'Bed',
    min: crewSize,
    max: crewSize + 2,
    required: true,
    reason: `Cada miembro de la tripulación necesita una cama (${crewSize} personas)`
  })

  // Sillas - al menos 1 por persona
  constraints.push({
    itemId: 'item-002',
    itemName: 'Chair',
    min: crewSize,
    max: crewSize * 2,
    required: true,
    reason: `Mínimo una silla por persona para trabajo y comidas`
  })

  // Mesas - al menos 1 cada 4 personas
  const minTables = Math.ceil(crewSize / 4)
  constraints.push({
    itemId: 'item-003',
    itemName: 'Table',
    min: minTables,
    max: Math.ceil(crewSize / 2),
    required: true,
    reason: `Espacio para comer y trabajar (1 mesa por cada 4 personas)`
  })

  // Baños - 1 cada 4 personas (mínimo 1)
  const minToilets = Math.max(1, Math.ceil(crewSize / 4))
  constraints.push({
    itemId: 'item-004',
    itemName: 'Toilet',
    min: minToilets,
    max: Math.ceil(crewSize / 2),
    required: true,
    reason: `Sanitarios suficientes para la tripulación`
  })

  // Duchas - 1 cada 4 personas (mínimo 1)
  const minShowers = Math.max(1, Math.ceil(crewSize / 4))
  constraints.push({
    itemId: 'item-010',
    itemName: 'Shower',
    min: minShowers,
    max: Math.ceil(crewSize / 2),
    required: true,
    reason: `Área de higiene personal`
  })

  // Comida - depende de duración
  const foodPerWeek = Math.ceil(crewSize / 2)
  const weeks = Math.ceil(duration / 7)
  const minFood = Math.min(10, foodPerWeek * weeks)
  constraints.push({
    itemId: 'item-001',
    itemName: 'Food',
    min: minFood,
    max: 10,
    required: true,
    reason: `Almacenamiento de comida para ${weeks} semanas`
  })

  // Refrigerador - 1 cada 4 personas
  const minFridges = Math.max(1, Math.ceil(crewSize / 4))
  constraints.push({
    itemId: 'item-012',
    itemName: 'Fridge',
    min: minFridges,
    max: Math.ceil(crewSize / 2),
    required: true,
    reason: `Conservación de alimentos`
  })

  // Cocina - 1 cada 6 personas
  const minKitchens = Math.max(1, Math.ceil(crewSize / 6))
  constraints.push({
    itemId: 'item-017',
    itemName: 'Kitchen',
    min: minKitchens,
    max: Math.ceil(crewSize / 3),
    required: true,
    reason: `Preparación de alimentos`
  })

  // Botiquín - siempre al menos 1
  constraints.push({
    itemId: 'item-013',
    itemName: 'Medkit',
    min: 1,
    max: Math.max(2, Math.ceil(crewSize / 4)),
    required: true,
    reason: `Emergencias médicas`
  })

  // Basura - 1 cada 3 personas
  const minTrash = Math.ceil(crewSize / 3)
  constraints.push({
    itemId: 'item-014',
    itemName: 'Trashcan',
    min: minTrash,
    max: crewSize,
    required: true,
    reason: `Gestión de residuos`
  })

  // EJERCICIO (obligatorio para misiones largas)
  if (duration >= 30) {
    const minTreadmills = Math.max(1, Math.ceil(crewSize / 4))
    constraints.push({
      itemId: 'item-019',
      itemName: 'Treadmill',
      min: minTreadmills,
      max: Math.ceil(crewSize / 2),
      required: true,
      reason: `Ejercicio cardiovascular necesario para misiones >30 días`
    })

    const minWeights = Math.max(1, Math.ceil(crewSize / 4))
    constraints.push({
      itemId: 'item-020',
      itemName: 'Weights',
      min: minWeights,
      max: Math.ceil(crewSize / 2),
      required: true,
      reason: `Fortalecimiento muscular para contrarrestar microgravedad`
    })

    recommendations.push('El ejercicio diario es crítico para prevenir atrofia muscular en el espacio')
  }

  // OPCIONALES RECOMENDADOS

  // Entretenimiento (recomendado para misiones largas)
  if (duration >= 30) {
    constraints.push({
      itemId: 'item-008',
      itemName: 'TV',
      min: 0,
      max: Math.ceil(crewSize / 3),
      required: false,
      reason: `Entretenimiento para salud mental en misiones largas`
    })

    constraints.push({
      itemId: 'item-021',
      itemName: 'Computer',
      min: 0,
      max: crewSize,
      required: false,
      reason: `Comunicación con la Tierra y entretenimiento`
    })

    recommendations.push('El entretenimiento es importante para la salud mental en misiones de larga duración')
  }

  // Closets - recomendados
  constraints.push({
    itemId: 'item-016',
    itemName: 'Closet',
    min: 0,
    max: crewSize,
    required: false,
    reason: `Almacenamiento personal`
  })

  // Lavamanos - recomendados
  constraints.push({
    itemId: 'item-011',
    itemName: 'Handwash',
    min: 0,
    max: minToilets + 2,
    required: false,
    reason: `Higiene adicional`
  })

  // Coffee - opcional pero recomendado
  constraints.push({
    itemId: 'item-005',
    itemName: 'Coffee',
    min: 0,
    max: 10,
    required: false,
    reason: `Moral y rutina de la tripulación`
  })

  // Toolbox - recomendado para Marte
  if (destination === 'mars') {
    constraints.push({
      itemId: 'item-015',
      itemName: 'Toolbox',
      min: 0,
      max: 5,
      required: false,
      reason: `Reparaciones en misiones a Marte`
    })
    recommendations.push('Las herramientas son esenciales para misiones a Marte debido a la distancia')
  }

  // Solar Battery - recomendado
  constraints.push({
    itemId: 'item-023',
    itemName: 'Solar Battery',
    min: 0,
    max: 5,
    required: false,
    reason: `Energía de respaldo`
  })

  // Clean Kit - recomendado
  constraints.push({
    itemId: 'item-024',
    itemName: 'Clean Kit',
    min: 0,
    max: 5,
    required: false,
    reason: `Mantenimiento del hábitat`
  })

  // Calcular totales
  const totalMinItems = constraints
    .filter(c => c.required)
    .reduce((sum, c) => sum + c.min, 0)
  
  const totalMaxItems = constraints.reduce((sum, c) => sum + c.max, 0)

  // Recomendaciones generales
  if (destination === 'moon') {
    recommendations.push('Misión lunar: prioriza eficiencia y espacio compacto')
  } else {
    recommendations.push('Misión a Marte: necesitarás mayor autosuficiencia y redundancia')
  }

  if (duration >= 180) {
    recommendations.push('Misión de larga duración: considera redundancia en sistemas críticos')
  }

  if (crewSize >= 5) {
    recommendations.push('Tripulación grande: asegura suficientes espacios privados y áreas comunes')
  }

  return {
    items: constraints,
    totalMinItems,
    totalMaxItems,
    recommendations
  }
}

/**
 * Valida si el layout actual cumple con los constraints
 */
export function validateLayout(
  placedItems: Array<{ itemId: string }>,
  constraints: LayoutConstraints
): {
  isValid: boolean
  violations: string[]
  warnings: string[]
} {
  const violations: string[] = []
  const warnings: string[] = []

  // Contar items por tipo
  const itemCounts = new Map<string, number>()
  placedItems.forEach(item => {
    const count = itemCounts.get(item.itemId) || 0
    itemCounts.set(item.itemId, count + 1)
  })

  // Validar cada constraint
  constraints.items.forEach(constraint => {
    const count = itemCounts.get(constraint.itemId) || 0

    if (constraint.required && count < constraint.min) {
      violations.push(
        `${constraint.itemName}: Se requieren al menos ${constraint.min}, tienes ${count}. ${constraint.reason}`
      )
    } else if (count < constraint.min && !constraint.required) {
      warnings.push(
        `${constraint.itemName}: Se recomienda al menos ${constraint.min}, tienes ${count}. ${constraint.reason}`
      )
    }

    if (count > constraint.max) {
      warnings.push(
        `${constraint.itemName}: Tienes ${count}, el máximo recomendado es ${constraint.max}`
      )
    }
  })

  return {
    isValid: violations.length === 0,
    violations,
    warnings
  }
}