import { useState, useEffect } from "react"

interface DigitSlotProps {
  newChar: string
  oldChar: string
  direction: "up" | "down"
}

function DigitSlot({ newChar, oldChar, direction }: DigitSlotProps) {
  const [animated, setAnimated] = useState(false)
  const unchanged = newChar === oldChar

  useEffect(() => {
    if (unchanged) return
    const frame = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(frame)
  }, [newChar])

  if (unchanged) {
    return (
      <span style={{ display: "inline-block", height: 22, overflow: "hidden" }}>
        <span style={{ display: "block", height: 22, lineHeight: "22px" }}>
          {newChar}
        </span>
      </span>
    )
  }

  const translateStart = direction === "up" ? "translateY(0)"     : "translateY(-22px)"
  const translateEnd   = direction === "up" ? "translateY(-22px)" : "translateY(0)"

  return (
    <span style={{ display: "inline-block", height: 22, overflow: "hidden" }}>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          transform: animated ? translateEnd : translateStart,
          transition: animated ? "transform 0.2s ease" : "none",
        }}
      >
        {direction === "up" ? (
          <>
            <span style={{ height: 22, lineHeight: "22px" }}>{oldChar}</span>
            <span style={{ height: 22, lineHeight: "22px" }}>{newChar}</span>
          </>
        ) : (
          <>
            <span style={{ height: 22, lineHeight: "22px" }}>{newChar}</span>
            <span style={{ height: 22, lineHeight: "22px" }}>{oldChar}</span>
          </>
        )}
      </span>
    </span>
  )
}

// Format helper

function format(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1)     + "K"
  return String(n)
}

//RollingCounter

function RollingCounter({ value }: { value: number }) {
  const [prev, setPrev] = useState(value)

  useEffect(() => {
    setPrev(value)
  }, [value])

  const newStr   = format(value)
  const oldStr   = format(prev)
  const direction = value >= prev ? "up" : "down"

  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end" }}>
      {newStr.split("").map((char, i) => (
        <DigitSlot
          key={i}
          newChar={char}
          oldChar={oldStr[i] ?? char}
          direction={direction}
        />
      ))}
    </span>
  )
}

export default RollingCounter