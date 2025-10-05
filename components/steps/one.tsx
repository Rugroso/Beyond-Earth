import { Card } from "@/components/ui/card"
import { Rocket, Moon, Users } from "lucide-react"

export function StepOne() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Bienvenido a Beyond Earth
        </h2>
        <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
          Diseña hábitats espaciales para la misión Artemis de NASA y futuras misiones a Marte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <Card className="bg-slate-800/50 border-blue-500/30 p-6 hover:scale-105 transition-transform">
          <div className="flex flex-col items-center text-center">
            <Moon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Misión Artemis</h3>
            <p className="text-sm text-blue-200/70">
              NASA planea regresar humanos a la Luna y establecer una presencia sostenible
              como preparación para Marte.
            </p>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30 p-6 hover:scale-105 transition-transform">
          <div className="flex flex-col items-center text-center">
            <Rocket className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Hábitats Espaciales</h3>
            <p className="text-sm text-blue-200/70">
              Los hábitats deben soportar funciones críticas: soporte de vida, gestión de residuos,
              control térmico, y más.
            </p>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-green-500/30 p-6 hover:scale-105 transition-transform">
          <div className="flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tu Misión</h3>
            <p className="text-sm text-blue-200/70">
              Diseña el interior del hábitat considerando el tamaño de la tripulación,
              duración de la misión y estándares de NASA.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg max-w-3xl">
        <p className="text-blue-200/90 text-center">
          <strong className="text-blue-300">💡 ¿Sabías qué?</strong> Los astronautas necesitan aproximadamente
          25-50 m³ de espacio habitable por persona dependiendo de la duración de la misión.
          ¡Más largo el viaje, más espacio necesitan para mantener la salud mental!
        </p>
      </div>
    </div>
  )
}
