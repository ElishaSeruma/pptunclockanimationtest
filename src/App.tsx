import { useEffect, useRef, useState } from "react"
import { ShaderAnimation } from "@/components/ui/shader-lines"
import { UnlockBackground } from "@/components/ui/unlock-background"
import { CharacterCard } from "@/components/ui/character-card"
import { CHARACTERS, type Character } from "@/lib/characters"
import { Lock, LockOpen, RotateCcw } from "lucide-react"

type Phase = "idle" | "reveal" | "card"

// how long the shader reveal plays before the card background takes over
const REVEAL_MS = 3800

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [character, setCharacter] = useState<Character | null>(null)
  const [phrase, setPhrase] = useState("")

  // per-character bag of unused phrases so repeats only happen after
  // the whole pool has been shown
  const phraseBags = useRef<Record<string, string[]>>({})
  const timerRef = useRef<number | null>(null)

  const pickPhrase = (c: Character) => {
    let bag = phraseBags.current[c.id]
    if (!bag || bag.length === 0) {
      bag = [...c.phrases]
      phraseBags.current[c.id] = bag
    }
    const i = Math.floor(Math.random() * bag.length)
    return bag.splice(i, 1)[0]
  }

  const unlock = (c: Character) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setCharacter(c)
    setPhrase(pickPhrase(c))
    setPhase("reveal")
    timerRef.current = window.setTimeout(() => setPhase("card"), REVEAL_MS)
  }

  const reset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setPhase("idle")
    setCharacter(null)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05060f]">
      {/* phase 1: shader lines reveal, tinted per character, phrase above it */}
      {phase === "reveal" && character && (
        <div className="absolute inset-0 animate-fade-in">
          <ShaderAnimation color={character.shaderColor} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-6">
            <span
              className="animate-reveal-pop px-8 text-center text-5xl font-semibold tracking-tight text-white md:text-7xl"
              style={{ textShadow: `0 0 40px ${character.accent}` }}
            >
              {phrase}
            </span>
            <span
              className="animate-fade-in flex items-center gap-2 text-lg uppercase tracking-[0.4em]"
              style={{ color: character.accent, animationDelay: "400ms" }}
            >
              <LockOpen className="h-5 w-5" />
              Character Unlocked
            </span>
          </div>
        </div>
      )}

      {/* phase 2: 3D name-marquee background + floating glare card */}
      {phase === "card" && character && (
        <div className="absolute inset-0 animate-fade-in">
          <UnlockBackground character={character}>
            <div className="animate-reveal-pop">
              <CharacterCard character={character} />
            </div>
          </UnlockBackground>
          <div className="pointer-events-none absolute inset-x-0 top-10 z-20 flex justify-center">
            <span
              className="font-indiana animate-fade-in text-6xl md:text-8xl"
              style={{
                color: character.accent,
                textShadow: `0 0 30px ${character.accent}66`,
              }}
            >
              {character.name}
            </span>
          </div>
        </div>
      )}

      {/* test controls */}
      {phase === "idle" ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-10 px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Character Unlock Test
            </h1>
            <p className="mt-3 text-white/50">
              Pick a character to preview their unlock sequence
            </p>
          </div>
          <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CHARACTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => unlock(c)}
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:scale-[1.03] hover:bg-white/10"
                style={{ boxShadow: `inset 0 0 0 0 ${c.accent}` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `inset 0 -2px 0 0 ${c.accent}`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = `inset 0 0 0 0 ${c.accent}`)
                }
              >
                <Lock className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:hidden" />
                <LockOpen
                  className="hidden h-3.5 w-3.5 transition-colors group-hover:block"
                  style={{ color: c.accent }}
                />
                Unlock {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={reset}
          className="absolute bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/70 backdrop-blur transition-colors hover:bg-black/60 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Test another
        </button>
      )}
    </div>
  )
}
