"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react"

export function ValidationPanel() {
  const context = useContext(EditorContext)

  if (!context) return null

  const { validationResult, missionConfig } = context
  const { isValid, issues, missingRequiredAreas, totalArea, totalVolume } = validationResult

  const errorIssues = issues.filter(i => i.severity === "error")
  const warningIssues = issues.filter(i => i.severity === "warning")
  const infoIssues = issues.filter(i => i.severity === "info")

  return (
    <Card className="h-full flex flex-col bg-slate-900/95 border-slate-700">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Design Validation</h3>
          {isValid ? (
            <Badge className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="w-4 h-4 mr-1" />
              Issues Found
            </Badge>
          )}
        </div>

        {/* Mission Info Summary */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Crew:</span>
            <span className="ml-2 text-white font-semibold">{missionConfig.crewSize}</span>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Duration:</span>
            <span className="ml-2 text-white font-semibold">{missionConfig.durationDays} days</span>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Total Area:</span>
            <span className="ml-2 text-white font-semibold">{totalArea.toFixed(1)} m²</span>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Volume:</span>
            <span className="ml-2 text-white font-semibold">{totalVolume.toFixed(1)} m³</span>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {issues.length === 0 ? (
            <Alert className="bg-green-900/20 border-green-700">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">
                All requirements met! Your habitat design is valid.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Errors */}
              {errorIssues.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-400">
                      Errors ({errorIssues.length})
                    </span>
                  </div>
                  {errorIssues.map((issue, idx) => (
                    <Alert
                      key={idx}
                      className="bg-red-900/20 border-red-700 cursor-pointer hover:bg-red-900/30 transition-colors"
                      onClick={() => {
                        // Highlight the affected zone on canvas if available
                        if (issue.affectedZoneId) {
                          const element = document.querySelector(`[data-zone-id="${issue.affectedZoneId}"]`)
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-200 text-sm">
                        {issue.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {warningIssues.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-400">
                      Warnings ({warningIssues.length})
                    </span>
                  </div>
                  {warningIssues.map((issue, idx) => (
                    <Alert
                      key={idx}
                      className="bg-yellow-900/20 border-yellow-700 cursor-pointer hover:bg-yellow-900/30 transition-colors"
                    >
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-yellow-200 text-sm">
                        {issue.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Info */}
              {infoIssues.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-400">
                      Suggestions ({infoIssues.length})
                    </span>
                  </div>
                  {infoIssues.map((issue, idx) => (
                    <Alert
                      key={idx}
                      className="bg-blue-900/20 border-blue-700"
                    >
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-200 text-sm">
                        {issue.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Missing Required Areas */}
          {missingRequiredAreas.length > 0 && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <h4 className="text-sm font-semibold text-red-300 mb-2">
                Missing Required Areas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingRequiredAreas.map(area => (
                  <Badge key={area} variant="destructive" className="text-xs">
                    {area.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer with tips */}
      <div className="flex-shrink-0 p-3 border-t border-slate-700 bg-slate-800/50">
        <p className="text-xs text-slate-400">
          💡 <strong>Tip:</strong> Click on error messages to highlight affected zones on the canvas
        </p>
      </div>
    </Card>
  )
}
