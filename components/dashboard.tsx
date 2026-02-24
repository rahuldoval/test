"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataPanel } from "@/components/data-panel"

function Logo() {
  return (
    <div
      className="absolute left-4 top-4 z-20 size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm"
      aria-hidden
    >
      C
    </div>
  )
}

export function Dashboard() {
  const [dataPanelOpen, setDataPanelOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-neutral-100 pt-3 pr-3 pb-3 pl-3 relative">
      <Logo />
      <main className="flex-1 min-w-0 flex items-start justify-center pt-16 px-6">
        <Card className="w-full max-w-[520px] animate-blur-in bg-white ring-0 border border-dashed border-neutral-200 shadow-none">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">Add more data to see accurate results</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Activities, essays, and background refine every section below.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 ml-4"
              onClick={() => setDataPanelOpen(true)}
            >
              Add details
            </Button>
          </CardContent>
        </Card>
      </main>

      <DataPanel open={dataPanelOpen} onOpenChange={setDataPanelOpen} />
    </div>
  )
}
