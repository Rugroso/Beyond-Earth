"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  speed: number
  rotation?: number
}

export default function MeteorDodgerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const router = useRouter()

  const gameDataRef = useRef({
    player: { x: 400, y: 500, width: 40, height: 40, speed: 8 },
    meteors: [] as GameObject[],
    bullets: [] as GameObject[],
    keys: {} as { [key: string]: boolean },
    animationId: 0,
    lastMeteorSpawn: 0,
    meteorSpawnRate: 800, // milliseconds
    lastShot: 0,
    shootCooldown: 200, // milliseconds between shots
  })

  const spawnMeteor = useCallback(() => {
    const size = Math.random() * 30 + 20 // 20-50px
    gameDataRef.current.meteors.push({
      x: Math.random() * (800 - size),
      y: -size,
      width: size,
      height: size,
      speed: Math.random() * 3 + 2, // 2-5 speed
      rotation: Math.random() * Math.PI * 2,
    })
  }, [])

  const shootBullet = useCallback(() => {
    const now = Date.now()
    const data = gameDataRef.current
    
    // Check cooldown
    if (now - data.lastShot < data.shootCooldown) return
    
    // Create bullet from player position
    data.bullets.push({
      x: data.player.x + data.player.width / 2 - 2,
      y: data.player.y,
      width: 4,
      height: 15,
      speed: 12,
    })
    
    data.lastShot = now
  }, [])

  const checkCollision = useCallback((rect1: GameObject, rect2: GameObject) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || gameState !== "playing") return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const data = gameDataRef.current

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update player position
    if (data.keys["ArrowLeft"] && data.player.x > 0) {
      data.player.x -= data.player.speed
    }
    if (data.keys["ArrowRight"] && data.player.x < canvas.width - data.player.width) {
      data.player.x += data.player.speed
    }
    if (data.keys["ArrowUp"] && data.player.y > 0) {
      data.player.y -= data.player.speed
    }
    if (data.keys["ArrowDown"] && data.player.y < canvas.height - data.player.height) {
      data.player.y += data.player.speed
    }
    
    // Shoot when Space is pressed
    if (data.keys[" "] || data.keys["Space"]) {
      shootBullet()
    }

    // Draw player (spaceship)
    ctx.save()
    ctx.translate(data.player.x + data.player.width / 2, data.player.y + data.player.height / 2)
    ctx.fillStyle = "#60a5fa"
    ctx.beginPath()
    ctx.moveTo(0, -data.player.height / 2)
    ctx.lineTo(-data.player.width / 2, data.player.height / 2)
    ctx.lineTo(data.player.width / 2, data.player.height / 2)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()

    // Update and draw bullets
    data.bullets.forEach((bullet, bulletIndex) => {
      bullet.y -= bullet.speed

      // Remove bullets off screen
      if (bullet.y < -bullet.height) {
        data.bullets.splice(bulletIndex, 1)
        return
      }

      // Draw bullet
      ctx.fillStyle = "#fbbf24"
      ctx.shadowColor = "#fbbf24"
      ctx.shadowBlur = 10
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      ctx.shadowBlur = 0

      // Check collision with meteors
      data.meteors.forEach((meteor, meteorIndex) => {
        if (checkCollision(bullet, meteor)) {
          // Remove both bullet and meteor
          data.bullets.splice(bulletIndex, 1)
          data.meteors.splice(meteorIndex, 1)
          // Award points for destroying meteor
          setScore((prev) => prev + 50)
        }
      })
    })

    // Spawn meteors
    const now = Date.now()
    if (now - data.lastMeteorSpawn > data.meteorSpawnRate) {
      spawnMeteor()
      data.lastMeteorSpawn = now
      // Increase difficulty over time
      if (data.meteorSpawnRate > 300) {
        data.meteorSpawnRate -= 5
      }
    }

    // Update and draw meteors
    data.meteors.forEach((meteor, index) => {
      meteor.y += meteor.speed
      meteor.rotation! += 0.02

      // Remove meteors that are off screen
      if (meteor.y > canvas.height) {
        data.meteors.splice(index, 1)
        setScore((prev) => prev + 10)
        return
      }

      // Draw meteor
      ctx.save()
      ctx.translate(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2)
      ctx.rotate(meteor.rotation!)
      
      // Meteor body
      ctx.fillStyle = "#78716c"
      ctx.beginPath()
      ctx.arc(0, 0, meteor.width / 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Meteor craters
      ctx.fillStyle = "#57534e"
      ctx.beginPath()
      ctx.arc(-meteor.width / 6, -meteor.width / 6, meteor.width / 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(meteor.width / 6, meteor.width / 8, meteor.width / 8, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()

      // Check collision with player
      if (checkCollision(data.player, meteor)) {
        setGameState("gameover")
        if (score > highScore) {
          setHighScore(score)
        }
      }
    })

    // Draw score
    ctx.fillStyle = "#ffffff"
    ctx.font = "24px Arial"
    ctx.fillText(`Puntuación: ${score}`, 20, 40)
    ctx.fillText(`Récord: ${highScore}`, 20, 70)

    data.animationId = requestAnimationFrame(gameLoop)
  }, [gameState, score, highScore, spawnMeteor, checkCollision, shootBullet])

  useEffect(() => {
    if (gameState === "playing") {
      const handleKeyDown = (e: KeyboardEvent) => {
        gameDataRef.current.keys[e.key] = true
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        gameDataRef.current.keys[e.key] = false
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)

      gameDataRef.current.animationId = requestAnimationFrame(gameLoop)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
        cancelAnimationFrame(gameDataRef.current.animationId)
      }
    }
  }, [gameState, gameLoop])

  const startGame = () => {
    setScore(0)
    setGameState("playing")
    gameDataRef.current.player = { x: 400, y: 500, width: 40, height: 40, speed: 8 }
    gameDataRef.current.meteors = []
    gameDataRef.current.bullets = []
    gameDataRef.current.keys = {}
    gameDataRef.current.lastMeteorSpawn = Date.now()
    gameDataRef.current.meteorSpawnRate = 800
    gameDataRef.current.lastShot = 0
  }

  const restartGame = () => {
    startGame()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">☄️ Esquiva Meteoros</h1>

        {/* Canvas */}
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-4 border-white/30 rounded-lg bg-slate-900"
          />

          {/* Menu Overlay */}
          {gameState === "menu" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-white">¡Prepárate!</h2>
                <p className="text-gray-300 max-w-md">
                  Usa las flechas del teclado para mover tu nave.
                  <br />
                  Presiona ESPACIO para disparar y destruir meteoros.
                  <br />
                  ¡Esquiva o destruye los meteoros para ganar puntos!
                </p>
                <Button
                  onClick={startGame}
                  className="bg-blue-600 hover:bg-blue-700 text-xl px-8 py-6"
                >
                  Comenzar Juego
                </Button>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-red-500">¡Game Over!</h2>
                <div className="text-white space-y-2">
                  <p className="text-2xl">Puntuación Final: {score}</p>
                  <p className="text-xl text-yellow-400">Récord: {highScore}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={restartGame}
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-4"
                  >
                    Reintentar
                  </Button>
                  <Button
                    onClick={() => router.push("/minigames")}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-6 py-4"
                  >
                    Volver
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-gray-400 text-sm max-w-2xl mx-auto">
          <p className="mb-2">
            <strong className="text-white">Controles:</strong> Usa las teclas de flecha (←↑↓→) para mover tu nave | Presiona ESPACIO para disparar
          </p>
          <p className="mb-2">
            <strong className="text-white">Puntuación:</strong> +10 puntos por cada meteoro esquivado | +50 puntos por cada meteoro destruido 💥
          </p>
          <p>
            <strong className="text-white">Objetivo:</strong> Esquiva o destruye los meteoros y sobrevive el mayor tiempo posible
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
