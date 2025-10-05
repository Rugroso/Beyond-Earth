"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Howl } from "howler"

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
  const backgroundMusicRef = useRef<Howl | null>(null)
  const shootSoundRef = useRef<Howl | null>(null)
  const rocketImageRef = useRef<HTMLImageElement | null>(null)
  const asteroidImageRef = useRef<HTMLImageElement | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

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
    heat: 0, // Heat level (0-100)
    overheated: false, // Is weapon overheated?
    lastCooldown: Date.now(), // Last time heat decreased
  })

  const spawnMeteor = useCallback((currentScore: number) => {
    // Increase meteor size range and speed based on score
    const difficultyMultiplier = 1 + (currentScore / 500) // Increases every 500 points
    const minSize = 20
    const maxSize = 30 + (difficultyMultiplier * 10) // Max size increases with score
    const size = Math.random() * (maxSize - minSize) + minSize
    
    const baseSpeed = 2 + (difficultyMultiplier * 0.5) // Speed increases gradually
    const speedVariation = 3 + difficultyMultiplier
    const speed = Math.random() * speedVariation + baseSpeed
    
    gameDataRef.current.meteors.push({
      x: Math.random() * (800 - size),
      y: -size,
      width: size,
      height: size,
      speed: Math.min(speed, 10), // Cap maximum speed at 10
      rotation: Math.random() * Math.PI * 2,
    })
  }, [])

  const shootBullet = useCallback(() => {
    const now = Date.now()
    const data = gameDataRef.current
    
    // Check if overheated
    if (data.overheated) return
    
    // Check cooldown
    if (now - data.lastShot < data.shootCooldown) return
    
    if (shootSoundRef.current) {
      shootSoundRef.current.seek(0)
      shootSoundRef.current.play()
      shootSoundRef.current.volume(0.3)
    }
    
    // Create bullet from player position
    data.bullets.push({
      x: data.player.x + data.player.width / 2 - 2,
      y: data.player.y,
      width: 4,
      height: 15,
      speed: 12,
    })
    
    // Increase heat by 15 per shot
    data.heat = Math.min(100, data.heat + 15)
    
    // Check if overheated
    if (data.heat >= 100) {
      data.overheated = true
    }
    
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

    // Update heat cooldown system
    const currentTime = Date.now()
    if (currentTime - data.lastCooldown > 100) { // Cool down every 100ms
      data.heat = Math.max(0, data.heat - 2) // Decrease by 2 every 100ms
      data.lastCooldown = currentTime
      
      // Reset overheated when heat drops below 50
      if (data.overheated && data.heat < 50) {
        data.overheated = false
      }
    }

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

    // Draw player (spaceship with image)
    if (rocketImageRef.current && imagesLoaded) {
      ctx.save()
      ctx.translate(data.player.x + data.player.width / 2, data.player.y + data.player.height / 2)
      ctx.drawImage(
        rocketImageRef.current,
        -data.player.width / 2. ,
        -data.player.height / 2  ,
        data.player.width,
        data.player.height
      )
      ctx.restore()
    }

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
      spawnMeteor(score)
      data.lastMeteorSpawn = now
      
      // Increase difficulty over time - spawn rate gets faster with score
      const baseSpawnRate = 800
      const minSpawnRate = 300
      const scoreReduction = Math.floor(score / 100) * 20 // Reduce by 20ms every 100 points
      data.meteorSpawnRate = Math.max(minSpawnRate, baseSpawnRate - scoreReduction)
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

      // Draw meteor with image
      if (asteroidImageRef.current && imagesLoaded) {
        ctx.save()
        ctx.translate(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2)
        ctx.rotate(meteor.rotation!)
        ctx.drawImage(
          asteroidImageRef.current,
          -meteor.width / 2,
          -meteor.height / 2,
          meteor.width,
          meteor.height
        )
        ctx.restore()
      }

      // Check collision with player
      if (checkCollision(data.player, meteor)) {
        setGameState("gameover")
        if (score > highScore) {
          setHighScore(score)
        }
      }
    })

    // Draw score with difficulty indicator
    ctx.fillStyle = "#ffffff"
    ctx.font = "24px Arial"
    ctx.fillText(`Puntuación: ${score}`, 20, 40)
    ctx.fillText(`Récord: ${highScore}`, 20, 70)
    
    // Show difficulty level
    const difficultyLevel = Math.floor(score / 500) + 1
    ctx.fillStyle = "#fbbf24"
    ctx.font = "20px Arial"
    ctx.fillText(`Nivel: ${difficultyLevel}`, 20, 100)

    // Draw heat bar
    const barWidth = 200
    const barHeight = 20
    const barX = canvas.width - barWidth - 20
    const barY = 20
    
    // Background bar
    ctx.fillStyle = "#333"
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    // Heat level bar
    const heatPercentage = data.heat / 100
    if (data.overheated) {
      ctx.fillStyle = "#ef4444" // Red when overheated
    } else if (data.heat > 70) {
      ctx.fillStyle = "#f97316" // Orange when high
    } else if (data.heat > 40) {
      ctx.fillStyle = "#fbbf24" // Yellow when medium
    } else {
      ctx.fillStyle = "#22c55e" // Green when low
    }
    ctx.fillRect(barX, barY, barWidth * heatPercentage, barHeight)
    
    // Bar border
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.strokeRect(barX, barY, barWidth, barHeight)
    
    // Heat label
    ctx.fillStyle = "#fff"
    ctx.font = "14px Arial"
    ctx.fillText("Calor", barX, barY - 5)
    
    // Overheated warning
    if (data.overheated) {
      ctx.fillStyle = "#ef4444"
      ctx.font = "bold 18px Arial"
      ctx.fillText("¡SOBRECALENTADO!", barX - 20, barY + barHeight + 20)
    }

    data.animationId = requestAnimationFrame(gameLoop)
  }, [gameState, score, highScore, spawnMeteor, checkCollision, shootBullet, imagesLoaded])

  useEffect(() => {
    if (gameState === "playing") {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent default behavior for game controls
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Space"].includes(e.key)) {
          e.preventDefault()
        }
        gameDataRef.current.keys[e.key] = true
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        // Prevent default behavior for game controls
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Space"].includes(e.key)) {
          e.preventDefault()
        }
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
    gameDataRef.current.heat = 0
    gameDataRef.current.overheated = false
    gameDataRef.current.lastCooldown = Date.now()
  }

  const restartGame = () => {
    startGame()
  }

  // Load images
  useEffect(() => {
    const rocketImg = new Image()
    const asteroidImg = new Image()
    
    let loadedCount = 0
    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === 2) {
        setImagesLoaded(true)
      }
    }
    
    rocketImg.onload = checkAllLoaded
    asteroidImg.onload = checkAllLoaded
    
    rocketImg.src = "/images/cohete.png"
    asteroidImg.src = "/images/Asteroids.png"
     
    rocketImageRef.current = rocketImg
    asteroidImageRef.current = asteroidImg
  }, [])

  // Background music setup
  useEffect(() => {
    // Initialize shoot sound effect
    shootSoundRef.current = new Howl({
      src: ["/sounds/plasma_sound.mp3"],
      volume: 1,
    })

    backgroundMusicRef.current = new Howl({
      src: ["/music/the-signal.wav"],
      loop: false,
      volume: 0,
      autoplay: true,
      onload: () => {
        console.log("Meteor Dodger music loaded")
      },
      onplay: () => {
        // Fade in from 0 to 0.2 over 2 seconds
        backgroundMusicRef.current?.fade(0, 0.1, 2000)
      },
      onend: () => {
        // Loop back to start when song ends
        backgroundMusicRef.current?.seek(0)
        backgroundMusicRef.current?.play()
      },
    })

    // Check every 100ms if we've reached 168 seconds, then loop back to 0
    const checkInterval = setInterval(() => {
      if (backgroundMusicRef.current) {
        const currentTime = backgroundMusicRef.current.seek() as number
        if (currentTime >= 168) {
          backgroundMusicRef.current.seek(0)
        }
      }
    }, 100)

    return () => {
      clearInterval(checkInterval)
      backgroundMusicRef.current?.unload()
      shootSoundRef.current?.unload()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Esquiva Meteoros</h1>

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
                    className="border-white/30 text-black hover:bg-white/10 text-lg px-6 py-4"
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
            <strong className="text-white">Puntuación:</strong> +10 puntos por cada meteoro esquivado | +50 puntos por cada meteoro destruido
          </p>
          <p className="mb-2">
            <strong className="text-white">Sistema de Calor:</strong> El arma se sobrecalienta si disparas mucho seguido. ¡Deja enfriar!
          </p>
          <p>
            <strong className="text-white">Objetivo:</strong> Esquiva o destruye los meteoros y sobrevive el mayor tiempo posible
          </p>
        </div>

        {/* Back to Minigames */}
        <Button
          onClick={() => router.push("/minigames")}
          variant="outline"
          className="mt-6 border-white/30 text-black hover:bg-white/10"
        >
          ← Volver a Minijuegos
        </Button>
      </div>
    </div>
  )
}
