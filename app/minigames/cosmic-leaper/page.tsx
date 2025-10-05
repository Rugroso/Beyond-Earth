// app/minigames/cosmic-leaper/page.tsx

"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Howl } from "howler"

// --- Configuración del Juego ---
const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 700
const JUMP_VELOCITY = -15
const GRAVITY = 0.6
const PLATFORM_COUNT = 10
const PLATFORM_MIN_GAP = 50
const PLATFORM_MAX_GAP = 100

interface Platform {
  x: number
  y: number
  width: number
  height: number
  isMoving: boolean
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  vy: number // Velocidad vertical
}

export default function CosmicLeaperPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const router = useRouter()
  const backgroundMusicRef = useRef<Howl | null>(null)

  const gameDataRef = useRef<{
    player: Player
    platforms: Platform[]
    animationId: number
    mouseX: number
  }>({
    // La nave es un poco más pequeña que en el juego de meteoros (40x40)
    player: { x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - 60, width: 30, height: 30, vy: 0 },
    platforms: [],
    animationId: 0,
    mouseX: CANVAS_WIDTH / 2, // Posición inicial del ratón
  })

  // Initialize music
  useEffect(() => {
    backgroundMusicRef.current = new Howl({
      src: ['/music/the-signal.wav'],
      loop: false, // Manejo manual del loop
      volume: 0,
      autoplay: true,
      onload: () => {
        console.log('Cosmic Leaper music loaded')
      },
      onplay: () => {
        // Fade in from 0 to 0.1 over 2 seconds
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.fade(0, 0.1, 2000)
        }
      },
      onend: () => {
        // Loop back to the beginning (second 0) when reaches second 168
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(0)
          backgroundMusicRef.current.play()
        }
      }
    })

    // Stop at 168 seconds using a timer
    const checkTime = setInterval(() => {
      if (backgroundMusicRef.current && backgroundMusicRef.current.playing()) {
        const currentTime = backgroundMusicRef.current.seek() as number
        if (currentTime >= 168) {
          backgroundMusicRef.current.seek(0)
        }
      }
    }, 100) // Check every 100ms

    return () => {
      clearInterval(checkTime)
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
    }
  }, [])

  // --- Inicialización y Lógica de Plataformas ---

  const createPlatform = useCallback((y: number, isMoving: boolean = false): Platform => {
    const width = Math.random() * 50 + 60 // 60-110px
    return {
      x: Math.random() * (CANVAS_WIDTH - width),
      y: y,
      width: width,
      height: 10,
      isMoving: isMoving,
    }
  }, [])

  const generateInitialPlatforms = useCallback(() => {
    const platforms: Platform[] = []
    platforms.push({ // Plataforma inicial fija
      x: CANVAS_WIDTH / 2 - 50,
      y: CANVAS_HEIGHT - 20,
      width: 100,
      height: 10,
      isMoving: false,
    })

    for (let i = 1; i < PLATFORM_COUNT; i++) {
      const lastY = platforms[platforms.length - 1].y
      const y = lastY - PLATFORM_MIN_GAP - Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP)
      const isMoving = Math.random() < 0.3 // 30% de plataformas móviles
      platforms.push(createPlatform(y, isMoving))
    }
    gameDataRef.current.platforms = platforms
  }, [createPlatform])

  // --- Lógica de Colisiones ---

  const checkPlatformCollision = useCallback((player: Player, platform: Platform) => {
    // Si el jugador está cayendo
    return (
      player.vy > 0 &&
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height && // Toca la parte superior
      gameState === "playing"
    )
  }, [gameState])

  // --- Bucle Principal del Juego ---

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || gameState !== "playing") return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const data = gameDataRef.current
    const player = data.player
    let platforms = data.platforms

    // 1. Limpiar Canvas y dibujar fondo
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // 2. Movimiento Horizontal (controlado por el ratón)
    const targetX = data.mouseX - player.width / 2;
    // Mueve suavemente hacia la posición del ratón para evitar movimientos bruscos
    player.x += (targetX - player.x) * 0.15; 
    
    // Asegurar que la nave no se salga de los límites
    player.x = Math.max(0, Math.min(player.x, CANVAS_WIDTH - player.width));


    // 3. Aplicar gravedad y movimiento vertical
    player.vy += GRAVITY
    player.y += player.vy

    // 4. Scroll vertical (Cámara)
    if (player.y < CANVAS_HEIGHT / 2 - 100 && player.vy < 0) {
      const scrollSpeed = -player.vy
      player.y = CANVAS_HEIGHT / 2 - 100 // Mantener al jugador en el centro
      
      // Mover todas las plataformas hacia abajo y actualizar score
      platforms = platforms.map(p => ({ ...p, y: p.y + scrollSpeed }))
      setScore(prev => prev + Math.floor(scrollSpeed / 10)) 
    }

    // 5. Generar nuevas plataformas (si es necesario)
    while (platforms.length < PLATFORM_COUNT || platforms[platforms.length - 1].y > -10) {
        const lastY = platforms.length > 0 ? platforms[platforms.length - 1].y : CANVAS_HEIGHT;
        const y = lastY - PLATFORM_MIN_GAP - Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP);
        const isMoving = Math.random() < 0.3;
        platforms.push(createPlatform(y, isMoving));
    }

    // 6. Eliminar plataformas fuera de la pantalla
    platforms = platforms.filter(p => p.y < CANVAS_HEIGHT + p.height)
    
    // 7. Detección de colisiones (Salto)
    platforms.forEach(p => {
      if (checkPlatformCollision(player, p)) {
        player.vy = JUMP_VELOCITY
      }
    })

    // 8. Detección de Game Over
    if (player.y > CANVAS_HEIGHT) {
      setGameState("gameover")
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    // 9. Dibujar plataformas y jugador
    
    // Dibujar plataformas (asteroides)
    platforms.forEach(p => {
        ctx.fillStyle = p.isMoving ? "#fbbf24" : "#94a3b8" // Amarillo para móvil, gris para estático
        ctx.fillRect(p.x, p.y, p.width, p.height)
    })

    // Dibujar jugador (Nave Espacial - Triángulo)
    // Lógica similar a meteor-dodger
    ctx.save()
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2)
    ctx.fillStyle = "#60a5fa"
    ctx.beginPath()
    ctx.moveTo(0, -player.height / 2)
    ctx.lineTo(-player.width / 2, player.height / 2)
    ctx.lineTo(player.width / 2, player.height / 2)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()


    // 10. Dibujar score
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px sans-serif"
    ctx.fillText(`Altitud: ${score}`, 20, 30)

    data.platforms = platforms
    data.animationId = requestAnimationFrame(gameLoop)
  }, [gameState, score, highScore, createPlatform, checkPlatformCollision])


  // --- Event Handlers y Ciclo de Vida ---

  const startGame = () => {
    setScore(0)
    setGameState("playing")
    generateInitialPlatforms()
    gameDataRef.current.player = { 
        x: gameDataRef.current.mouseX - gameDataRef.current.player.width / 2, // Sincroniza con la posición inicial del ratón
        y: CANVAS_HEIGHT - 60, 
        width: 30, 
        height: 30, 
        vy: JUMP_VELOCITY // Primer salto al inicio
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas || gameState !== "playing") return

    const rect = canvas.getBoundingClientRect()
    // Calcula la posición X del ratón relativa al canvas
    gameDataRef.current.mouseX = e.clientX - rect.left
  }, [gameState])

  useEffect(() => {
    if (gameState === "playing") {
      
      // Eliminar el listener de teclado y usar el de ratón
      window.addEventListener("mousemove", handleMouseMove)
      gameDataRef.current.animationId = requestAnimationFrame(gameLoop)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        cancelAnimationFrame(gameDataRef.current.animationId)
      }
    }
  }, [gameState, gameLoop, handleMouseMove])

  const restartGame = () => {
    startGame()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">🚀 Salto Cósmico</h1>

        {/* Canvas */}
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            // *** CAMBIO AQUÍ: Se elimina 'cursor-none' para mostrar el cursor por defecto ***
            className="border-4 border-white/30 rounded-lg bg-slate-900" 
          />

          {/* Overlay de Menú/Game Over */}
          {(gameState === "menu" || gameState === "gameover") && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  {gameState === "menu" ? "¡Bienvenido!" : "¡Caída Libre!"}
                </h2>
                
                {gameState === "gameover" && (
                    <div className="text-white space-y-2">
                        <p className="text-2xl">Altitud Final: {score}</p>
                        <p className="text-xl text-yellow-400">Récord: {highScore}</p>
                    </div>
                )}
                
                <p className="text-gray-300 max-w-md">
                  Mueve el ratón para controlar la nave. ¡Evita caer al vacío!
                </p>
                <Button
                  onClick={gameState === "menu" ? startGame : restartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-xl px-8 py-6"
                >
                  {gameState === "menu" ? "Comenzar Salto" : "Reintentar"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-gray-400 text-sm max-w-2xl mx-auto">
          <p className="mb-2">
            <strong className="text-white">Controles:</strong> Mueve el **ratón** a la izquierda o derecha para dirigir la nave. El salto es automático al aterrizar en una plataforma.
          </p>
          <p>
            <strong className="text-white">Objetivo:</strong> Alcanza la mayor altitud posible antes de caer por la parte inferior.
          </p>
        </div>

        {/* Back to Minigames */}
        <Button
          onClick={() => router.push("/minigames")}
          variant="outline"
          className="mt-6 border-white/30 text-white hover:bg-white/10"
        >
          ← Volver a Minijuegos
        </Button>
      </div>
    </div>
  )
}