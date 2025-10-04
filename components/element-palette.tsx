"use client"

export function ElementPalette() {
  return (
    <div className="flex flex-col gap-4 bg-muted/30 p-4 border-l border-border">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="h-4 w-4 bg-primary rounded" />
        <span>Element</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex h-16 w-16 items-center justify-center bg-muted rounded-lg">
          <div className="h-0 w-0 border-b-[30px] border-l-[17px] border-r-[17px] border-b-foreground/60 border-l-transparent border-r-transparent" />
        </div>
        <div className="flex h-16 w-16 items-center justify-center bg-muted rounded-lg">
          <div className="h-8 w-8 bg-foreground/60 rounded" />
        </div>
        <div className="flex h-16 w-16 items-center justify-center bg-muted rounded-lg">
          <div className="h-8 w-8 bg-foreground/60 rounded-full" />
        </div>
      </div>
    </div>
  )
}
