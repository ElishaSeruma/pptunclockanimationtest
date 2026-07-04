"use client"

import { GlareCard } from "@/components/ui/glare-card"
import type { Character } from "@/lib/characters"

// Glare card wrapped in a subtle float animation, showing the unlocked character
export function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="animate-card-float">
      <GlareCard className="flex flex-col items-center justify-center relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
        <p
          className="font-indiana absolute bottom-6 z-10 text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{ color: character.accent }}
        >
          {character.name}
        </p>
      </GlareCard>
    </div>
  )
}
