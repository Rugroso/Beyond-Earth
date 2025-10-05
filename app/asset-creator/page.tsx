import { DrawingCanvas } from "@/components/drawing-canvas"

export default function AssetCreatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <DrawingCanvas />
      </div>
    </div>
  )
}
