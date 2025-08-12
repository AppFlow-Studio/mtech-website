'use client'

import { Button } from "./ui/button"

export default function DisableDraftModeButton({ disable }: { disable: () => Promise<void> }) {
  return (
    <Button className="font-semibold text-center bg-white text-black" onClick={async () => {
      await disable()
    }}>
      Turn Off Draft Mode
    </Button>
  )
}