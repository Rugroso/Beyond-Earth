import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

export function StepTwo() {
  const habitatTypes = [
    {
      name: "Metálico",
      icon: "🔩",
      color: "border-slate-500",
      description: "Estructura tradicional de metal, lanzada completamente ensamblada",
      pros: [
        "Tecnología probada y confiable",
        "Alta resistencia estructural",
        "Listo para usar al llegar",
        "Buena protección contra radiación"
      ],
      cons: [
        "Pesado (alto costo de lanzamiento)",
        "Limitado por tamaño del vehículo",
        "Tamaño fijo, no expandible"
      ]
    },
    {
      name: "Inflable",
      icon: "🎈",
      color: "border-orange-500",
      description: "Estructura blanda, lanzada compacta e inflada en el sitio",
      pros: [
        "Ligero y compacto para lanzamiento",
        "Gran volumen en paquete pequeño",
        "Espacio interior más flexible",
        "Menores costos de lanzamiento"
      ],
      cons: [
        "Tecnología más nueva",
        "Preocupaciones sobre micrometeoritos",
        "Requiere inflado cuidadoso",
        "Puede necesitar estructura interna"
      ]
    },
    {
      name: "ISRU (In-Situ)",
      icon: "🏗️",
      color: "border-yellow-500",
      description: "Construido en el lugar usando materiales locales (regolito, impresión 3D)",
      pros: [
        "Usa materiales locales",
        "Excelente protección radiación",
        "Puede ser muy grande",
        "Mínima masa de lanzamiento"
      ],
      cons: [
        "Requiere construcción robótica",
        "Largo tiempo de instalación",
        "Tecnología en desarrollo",
        "Depende de recursos locales"
      ]
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Tipos de Hábitats Espaciales
        </h2>
        <p className="text-lg text-blue-200/80 max-w-3xl mx-auto">
          Existen tres clases principales de estructuras de hábitats espaciales,
          cada una con sus ventajas y desventajas únicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-8">
        {habitatTypes.map((habitat) => (
          <Card
            key={habitat.name}
            className={`bg-slate-800/50 border-2 ${habitat.color} p-6 hover:scale-105 transition-transform`}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">{habitat.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{habitat.name}</h3>
              <p className="text-sm text-blue-200/70">{habitat.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-green-400 font-semibold mb-2">✓ Ventajas:</p>
                <div className="space-y-1">
                  {habitat.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-green-200/80">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-red-400 font-semibold mb-2">✗ Desventajas:</p>
                <div className="space-y-1">
                  {habitat.cons.map((con, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-red-200/80">{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg max-w-4xl">
        <p className="text-purple-200/90 text-center">
          <strong className="text-purple-300">🚀 Dato Espacial:</strong> El módulo Bigelow BEAM de la ISS
          es un hábitat inflable que se expandió de 2.4m³ a 16m³ - ¡casi 7 veces su tamaño compactado!
        </p>
      </div>
    </div>
  )
}
