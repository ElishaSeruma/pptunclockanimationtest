"use client"

import { useEffect, useRef } from "react"
import type { Character } from "@/lib/characters"

// Adapted from the 3D poem animation: the scrolling text is replaced with
// repeated instances of the unlocked character's name (Indiana Jonas font),
// and the hero image is replaced by the floating character card (children).
export const UnlockBackground = ({
  character,
  children,
}: {
  character: Character
  children?: React.ReactNode
}) => {
  const contentRef = useRef<HTMLDivElement>(null)

  // Responsive scaling of the fixed-size animation stage
  useEffect(() => {
    function adjustContentSize() {
      if (contentRef.current) {
        const viewportWidth = window.innerWidth
        const baseWidth = 1000
        const scaleFactor =
          viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1
        contentRef.current.style.transform = `scale(${scaleFactor})`
      }
    }

    adjustContentSize()
    window.addEventListener("resize", adjustContentSize)
    return () => window.removeEventListener("resize", adjustContentSize)
  }, [])

  // A long run of repeated names feeds the marquee cube faces
  const nameRun = Array(40).fill(character.name).join(" • ")
  const nameHTML = `<p>${nameRun}</p>`

  return (
    <header
      className="hero-section"
      style={{ "--accent": character.accent } as React.CSSProperties}
    >
      <div className="hero-container">
        <div
          ref={contentRef}
          className="content"
          style={{ display: "block", width: "1000px", height: "562px" }}
        >
          <div className="container-full">
            <div className="animated hue"></div>
            <div className="accent-wash"></div>

            <div className="hero-container cube-stage">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div
                  className="face left text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
                <div
                  className="face right text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
                <div className="face front"></div>
                <div
                  className="face back text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
              </div>
            </div>

            <div className="container-reflect cube-stage">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div
                  className="face left text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
                <div
                  className="face right text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
                <div className="face front"></div>
                <div
                  className="face back text name-text"
                  dangerouslySetInnerHTML={{ __html: nameHTML }}
                ></div>
              </div>
            </div>

            {/* Floating character card replaces the hero image */}
            <div className="card-slot">{children}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
