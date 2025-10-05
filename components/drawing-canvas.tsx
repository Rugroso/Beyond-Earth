"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ffffff")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<"brush" | "eraser">("brush")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.strokeStyle = "rgba(0,0,0,1)"
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = color
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveAsset = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to PNG
    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const timestamp = new Date().getTime()
      link.download = `asset-${timestamp}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }, "image/png")
  }

  const colors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080"
  ]

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white">Asset Creator</h2>

      {/* Canvas */}
      <div className="relative bg-slate-800 rounded-lg p-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-white/20 rounded bg-slate-700 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Tools */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Tool Selection */}
        <div className="flex gap-2">
          <Button
            onClick={() => setTool("brush")}
            variant={tool === "brush" ? "default" : "outline"}
            className={tool === "brush" ? "bg-blue-600" : ""}
          >
            🖌️ Pincel
          </Button>
          <Button
            onClick={() => setTool("eraser")}
            variant={tool === "eraser" ? "default" : "outline"}
            className={tool === "eraser" ? "bg-blue-600" : ""}
          >
            🧹 Borrador
          </Button>
        </div>

        {/* Color Picker */}
        <div className="flex gap-2 items-center">
          <span className="text-white text-sm font-medium">Color:</span>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c)
                setTool("brush")
              }}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c && tool === "brush" ? "border-blue-400 scale-110" : "border-white/30"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          {/* Custom Color Picker */}
          <div className="relative group">
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value)
                setTool("brush")
              }}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white/30 hover:border-blue-400 transition-colors"
              title="Selector de color personalizado"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Personalizado
            </span>
          </div>
          {/* Current color display */}
          <div className="flex items-center gap-2 ml-2 px-3 py-1 bg-slate-800 rounded-lg border border-white/20">
            <span className="text-white text-xs">Actual:</span>
            <div 
              className="w-6 h-6 rounded border-2 border-white/30"
              style={{ backgroundColor: color }}
            />
            <span className="text-white text-xs font-mono">{color.toUpperCase()}</span>
          </div>
        </div>

        {/* Brush Size */}
        <div className="flex gap-2 items-center min-w-[200px]">
          <span className="text-white text-sm">Tamaño:</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            min={1}
            max={50}
            step={1}
            className="flex-1"
          />
          <span className="text-white text-sm w-8">{brushSize}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={clearCanvas}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            🗑️ Limpiar
          </Button>
          <Button
            onClick={saveAsset}
            className="bg-green-600 hover:bg-green-700"
          >
            💾 Guardar PNG
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-400 bg-slate-800 p-3 rounded">
        <p><strong>Instrucciones:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Haz clic y arrastra para dibujar en el canvas</li>
          <li>Selecciona un color de la paleta o usa el selector personalizado</li>
          <li>Ajusta el tamaño del pincel con el slider</li>
          <li>Usa el borrador para eliminar partes del dibujo</li>
          <li>Guarda tu asset en formato PNG transparente</li>
        </ul>
      </div>
    </div>
  )
}
