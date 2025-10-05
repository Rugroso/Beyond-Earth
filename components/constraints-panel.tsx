"use client"

import { useContext, useMemo } from 'react'
import { EditorContext } from '@/contexts/editor-context'
import { useSetup } from '@/contexts/setup-context'
import { validateLayout } from '@/utils/constraints-generator'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export function ConstraintsPanel() {
  const editorContext = useContext(EditorContext)
  const { constraints, setup } = useSetup()

  if (!editorContext || !constraints) return null

  const { placedItems } = editorContext

  const validation = useMemo(() => {
    return validateLayout(placedItems, constraints)
  }, [placedItems, constraints])

  // Contar items por tipo
  const itemCounts = useMemo(() => {
    const counts = new Map<string, number>()
    placedItems.forEach(item => {
      const count = counts.get(item.itemId) || 0
      counts.set(item.itemId, count + 1)
    })
    return counts
  }, [placedItems])

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-h-[500px] overflow-y-auto">
      <div className="space-y-4">
        {/* Header con resumen de misión */}
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold text-white mb-2">Requisitos de Misión</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Destino:</span>
              <span className="text-white ml-2 capitalize">{setup.destination}</span>
            </div>
            <div>
              <span className="text-gray-400">Duración:</span>
              <span className="text-white ml-2">{setup.duration} días</span>
            </div>
            <div>
              <span className="text-gray-400">Tripulación:</span>
              <span className="text-white ml-2">{setup.crewSize} personas</span>
            </div>
            <div>
              <span className="text-gray-400">Tamaño:</span>
              <span className="text-white ml-2 capitalize">{setup.canvasSize}</span>
            </div>
          </div>
        </div>

        {/* Estado de validación */}
        <div className={`flex items-center gap-2 p-2 rounded ${
          validation.isValid 
            ? 'bg-green-900/30 border border-green-500/30' 
            : 'bg-red-900/30 border border-red-500/30'
        }`}>
          {validation.isValid ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">
                Diseño válido - Listo para la misión
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">
                {validation.violations.length} requisito(s) faltante(s)
              </span>
            </>
          )}
        </div>

        {/* Violaciones (requisitos obligatorios no cumplidos) */}
        {validation.violations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Requisitos Obligatorios
            </h4>
            {validation.violations.map((violation, i) => (
              <div key={i} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                {violation}
              </div>
            ))}
          </div>
        )}

        {/* Advertencias (recomendaciones) */}
        {validation.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Recomendaciones
            </h4>
            {validation.warnings.slice(0, 3).map((warning, i) => (
              <div key={i} className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                {warning}
              </div>
            ))}
            {validation.warnings.length > 3 && (
              <div className="text-xs text-gray-400">
                +{validation.warnings.length - 3} recomendaciones más
              </div>
            )}
          </div>
        )}

        {/* Lista de items requeridos con progreso */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Items Requeridos</h4>
          <div className="space-y-1">
            {constraints.items
              .filter(c => c.required)
              .map(constraint => {
                const count = itemCounts.get(constraint.itemId) || 0
                const isMet = count >= constraint.min
                const percentage = Math.min(100, (count / constraint.min) * 100)
                
                return (
                  <div key={constraint.itemId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isMet ? 'text-green-400' : 'text-white'}>
                        {constraint.itemName}
                      </span>
                      <span className={isMet ? 'text-green-400' : 'text-gray-400'}>
                        {count}/{constraint.min}
                        {isMet && <CheckCircle className="inline h-3 w-3 ml-1" />}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isMet ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Recomendaciones generales */}
        {constraints.recommendations.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-3">
            <h4 className="text-sm font-semibold text-blue-400">Consejos</h4>
            {constraints.recommendations.map((rec, i) => (
              <div key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}