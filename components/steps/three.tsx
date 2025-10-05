import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function StepThree() {
  const functionalAreas = [
    { name: "Dormitorios", icon: "🛏️", required: true, color: "bg-slate-700" },
    { name: "Higiene", icon: "🚽", required: true, color: "bg-blue-700" },
    { name: "Comida", icon: "🍽️", required: true, color: "bg-orange-700" },
    { name: "Ejercicio", icon: "💪", required: true, color: "bg-red-700" },
    { name: "Trabajo", icon: "🖥️", required: true, color: "bg-purple-700" },
    { name: "Almacenaje", icon: "📦", required: true, color: "bg-gray-700" },
    { name: "Médico", icon: "🏥", required: true, color: "bg-red-600" },
    { name: "Recreación", icon: "🎮", required: false, color: "bg-purple-600" },
  ]

  const designRules = [
    {
      title: "Reglas de Adyacencia",
      icon: "✅",
      color: "text-green-400",
      examples: [
        "Dormitorios cerca del área común",
        "Cocina junto al almacenaje",
        "Ejercicio cerca del área médica"
      ]
    },
    {
      title: "Reglas de Separación",
      icon: "❌",
      color: "text-red-400",
      examples: [
        "Dormitorios lejos del ejercicio (ruido)",
        "Higiene separada de cocina",
        "Mantenimiento lejos de dormitorios"
      ]
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Áreas Funcionales del Hábitat
        </h2>
        <p className="text-lg text-blue-200/80 max-w-3xl mx-auto">
          Un hábitat espacial debe incluir múltiples áreas funcionales.
          Aprende sobre ellas y las mejores prácticas de diseño de NASA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mb-8">
        {/* Functional Areas */}
        <Card className="bg-slate-800/50 border-blue-500/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Áreas Funcionales
          </h3>
          <div className="space-y-3">
            {functionalAreas.map((area) => (
              <div
                key={area.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${area.color} rounded-lg flex items-center justify-center text-xl`}>
                    {area.icon}
                  </div>
                  <span className="text-white font-medium">{area.name}</span>
                </div>
                {area.required ? (
                  <Badge className="bg-red-600">Requerido</Badge>
                ) : (
                  <Badge variant="outline" className="border-blue-400 text-blue-400">Opcional</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Design Rules */}
        <div className="space-y-6">
          {designRules.map((rule) => (
            <Card key={rule.title} className="bg-slate-800/50 border-blue-500/30 p-6">
              <h3 className={`text-xl font-bold ${rule.color} mb-4 flex items-center gap-2`}>
                <span>{rule.icon}</span> {rule.title}
              </h3>
              <div className="space-y-2">
                {rule.examples.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span className="text-sm text-blue-200/80">{example}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Size Requirements */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 max-w-4xl">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-bold mb-2">Requisitos de Tamaño</h4>
            <p className="text-blue-200/80 text-sm mb-3">
              Cada área funcional tiene requisitos mínimos de tamaño basados en:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-blue-200/80">Tamaño de la tripulación</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-blue-200/80">Duración de la misión</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-blue-200/80">Estándares de NASA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-blue-200/80">Factor de escala temporal</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg max-w-4xl">
        <p className="text-green-200/90 text-center">
          <strong className="text-green-300">🎯 ¡Listo para Diseñar!</strong> En el siguiente paso,
          configurarás tu misión y comenzarás a diseñar el interior del hábitat usando drag & drop.
        </p>
      </div>
    </div>
  )
}
