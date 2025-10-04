import { EditableCanvas } from "@/components/editable-canvas/editable-canvas"
import { Toolbar } from "@/components/toolbar/toolbar"

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-border bg-muted/50 px-6 py-4">
        <h1 className="text-lg font-medium text-foreground">Edit Screen</h1>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <EditableCanvas />
          </div>
          {/* Toolbar */}
          <Toolbar />
        </div>

      </div>
    </div>
  )
}
