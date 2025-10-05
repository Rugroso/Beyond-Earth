"use client"

import { useRef, useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Howl } from "howler"
import { EditorContext } from "@/contexts/editor-context"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Download } from "lucide-react"

interface DrawingCanvasProps {
  onClose?: () => void;
}

export function DrawingCanvas({ onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ffffff")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<"brush" | "eraser">("brush")
  const backgroundMusicRef = useRef<Howl | null>(null)
  const editorContext = useContext(EditorContext)
  const { toast } = useToast()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Initialize Howler background music
    backgroundMusicRef.current = new Howl({
      src: ['/music/orbit.wav'],
      loop: true,
      volume: 0,
      autoplay: true,
      onload: () => {
        console.log('Drawing canvas music loaded')
        // Seek to 48 seconds when loaded
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(48)
        }
      },
      onplay: () => {
        // Fade in from 0 to 0.7 over 3 seconds
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.fade(0, 0.7, 3000)
        }
      }
    })

    return () => {
      // Cleanup Howler instance
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
    }
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

  const addToAssets = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/png")
    const timestamp = new Date().getTime()
    const assetName = `Drawing-${timestamp}`

    // Add to editor context if available
    if (editorContext) {
      editorContext.addCustomAsset(assetName, imageDataUrl)
      toast({
        title: "✨ Asset agregado",
        description: `${assetName} ahora está disponible en Miscellaneous`,
      })

      // Clear canvas after adding
      clearCanvas()

      // Close modal if onClose is provided
      if (onClose) {
        onClose()
      }
    } else {
      toast({
        title: "Error",
        description: "No se pudo agregar el asset. Editor context no disponible.",
        variant: "destructive",
      })
    }
  }

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const timestamp = new Date().getTime()
      link.download = `drawing-${timestamp}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "📥 PNG descargado",
        description: "Tu dibujo se ha guardado exitosamente",
      })
    }, "image/png")
  }

  const colors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080"
  ]

  return (
    <div className="flex flex-col gap-4 bg-slate-900 rounded-lg max-h-[90vh] overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Creador de Assets</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-800 rounded-lg p-4 mx-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-white/20 rounded bg-slate-700 cursor-crosshair max-w-full"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Tools */}
      <div className="flex flex-wrap gap-4 items-center px-4">
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
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === "brush" ? "border-blue-400 scale-110" : "border-white/30"
                }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          {/* Custom Color Picker */}
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
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4 justify-end">
        <Button
          onClick={clearCanvas}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          🗑️ Limpiar
        </Button>
        <Button
          onClick={downloadPNG}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar PNG
        </Button>
        <Button
          onClick={addToAssets}
          className="bg-green-600 hover:bg-green-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar a Assets
        </Button>
      </div>
    </div>
  )
}
