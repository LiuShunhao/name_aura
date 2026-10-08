import { digitElement, lookupShuli, luckScore, type Luck } from "@/lib/numerology"
import { relation, type Element } from "@/lib/elements"

export type WugeGrids = {
  tian: number
  ren: number
  di: number
  wai: number
  zong: number
}

export type GridReading = {
  key: keyof WugeGrids
  label: string
  strokes: number
  index: number
  level: Luck
  title: string
  gloss: string
  element: Element
}

export type WugeReading = {
  grids: WugeGrids
  readings: GridReading[]
  sancai: {
    tian: Element
    ren: Element
    di: Element
    flow: string
    harmonious: boolean
  }
  score: number
  blocked: boolean
  severe: string[]
}

const LABELS: Record<keyof WugeGrids, string> = {
  tian: "天格",
  ren: "人格",
  di: "地格",
  wai: "外格",
  zong: "总格",
}

export function computeWuge(surname: number[], given: number[]): WugeGrids {
  const s = surname
  const g = given
  if (s.length === 1 && g.length === 1) {
    return {
      tian: s[0] + 1,
      ren: s[0] + g[0],
      di: g[0] + 1,
      wai: 2,
      zong: s[0] + g[0],
    }
  }
  if (s.length === 1 && g.length === 2) {
    const zong = s[0] + g[0] + g[1]
    const ren = s[0] + g[0]
    return {
      tian: s[0] + 1,
      ren,
      di: g[0] + g[1],
      zong,
      wai: zong - ren + 1,
    }
  }
  if (s.length === 2 && g.length === 1) {
    return {
      tian: s[0] + s[1],
      ren: s[1] + g[0],
      di: g[0] + 1,
      zong: s[0] + s[1] + g[0],
      wai: s[0] + 1,
    }
  }
  if (s.length === 2 && g.length === 2) {
    return {
      tian: s[0] + s[1],
      ren: s[1] + g[0],
      di: g[0] + g[1],
      zong: s[0] + s[1] + g[0] + g[1],
      wai: s[0] + g[1],
    }
  }
  const all = [...s, ...g]
  const zong = all.reduce((sum, n) => sum + n, 0)
  return {
    tian: s.reduce((sum, n) => sum + n, 0) || 1,
    ren: (s.at(-1) ?? 1) + (g[0] ?? 1),
    di: g.reduce((sum, n) => sum + n, 0) || 1,
    wai: 2,
    zong,
  }
}

export function readWuge(grids: WugeGrids): WugeReading {
  const keys: Array<keyof WugeGrids> = ["tian", "ren", "di", "wai", "zong"]
  const readings: GridReading[] = keys.map((key) => {
    const strokes = grids[key]
    const shuli = lookupShuli(strokes)
    return {
      key,
      label: LABELS[key],
      strokes,
      index: shuli.n,
      level: shuli.level,
      title: shuli.title,
      gloss: shuli.gloss,
      element: digitElement(strokes),
    }
  })
  const byKey = Object.fromEntries(readings.map((item) => [item.key, item])) as Record<
    keyof WugeGrids,
    GridReading
  >
  const tianToRen = relation(byKey.tian.element, byKey.ren.element)
  const renToDi = relation(byKey.ren.element, byKey.di.element)
  const harmonious =
    (tianToRen === "比和" || tianToRen === "生出" || tianToRen === "生入") &&
    (renToDi === "比和" || renToDi === "生出")
  const fought = tianToRen === "克入" || renToDi === "克入"
  const flow = `天格${byKey.tian.element}${tianToRen === "生出" ? "生" : tianToRen === "生入" ? "受生于" : tianToRen === "克出" ? "克" : tianToRen === "克入" ? "受克于" : "比"}人格${byKey.ren.element}，人格${renToDi === "生出" ? "生" : renToDi === "生入" ? "受生于" : renToDi === "克出" ? "克" : renToDi === "克入" ? "受克于" : "比"}地格${byKey.di.element}`

  const weights: Record<keyof WugeGrids, number> = {
    ren: 0.34,
    zong: 0.24,
    di: 0.22,
    wai: 0.12,
    tian: 0.08,
  }
  let score = keys.reduce((sum, key) => sum + luckScore(byKey[key].level) * weights[key], 0)
  if (harmonious) score += 6
  if (fought) score -= 10
  score = Math.max(0, Math.min(100, Math.round(score)))

  const severe = readings
    .filter((item) => item.key !== "tian" && (item.level === "大凶" || item.level === "凶"))
    .map((item) => `${item.label}${item.strokes}画${item.level}`)
  const blocked = ["ren", "di", "zong"].some((key) => byKey[key as keyof WugeGrids].level === "大凶")

  return { grids, readings, sancai: { tian: byKey.tian.element, ren: byKey.ren.element, di: byKey.di.element, flow, harmonious }, score, blocked, severe }
}
