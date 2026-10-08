import { Solar } from "lunar-javascript"
import {
  BRANCH_ANIMAL,
  BRANCH_ELEMENT,
  STEM_ELEMENT,
  controlledBy,
  controls,
  generatedBy,
  generates,
  type Element,
} from "@/lib/elements"

export type Pillar = {
  gan: string
  zhi: string
  ganElement: Element
  zhiElement: Element
  hide: string[]
  label: string
}

export type ElementScore = Record<Element, number>

export type Chart = {
  pillars: Pillar[]
  dayMaster: string
  dayElement: Element
  yearBranch: string
  baziAnimal: string
  folkAnimal: string
  animalNote: string
  scores: ElementScore
  strong: boolean
  strengthLabel: string
  yong: Element[]
  ji: Element[]
  climate: Element | null
  summary: string
  hourKnown: boolean
  nayin: string[]
}

const HIDE_WEIGHT = [1, 0.45, 0.2]

function pillar(
  label: string,
  gan: string,
  zhi: string,
  hide: string[],
): Pillar {
  return {
    label,
    gan,
    zhi,
    ganElement: STEM_ELEMENT[gan],
    zhiElement: BRANCH_ELEMENT[zhi],
    hide,
  }
}

function add(scores: ElementScore, element: Element | undefined, amount: number) {
  if (!element || amount === 0) return
  scores[element] += amount
}

export function castChart(input: {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
}): Chart {
  const hourKnown = Number.isFinite(input.hour)
  const hour = hourKnown ? (input.hour as number) : 12
  const minute = hourKnown ? (input.minute ?? 0) : 0
  const lunar = Solar.fromYmdHms(input.year, input.month, input.day, hour, minute, 0).getLunar()
  const eight = lunar.getEightChar()
  eight.setSect(1)

  const pillars = [
    pillar("年", eight.getYearGan(), eight.getYearZhi(), [...eight.getYearHideGan()]),
    pillar("月", eight.getMonthGan(), eight.getMonthZhi(), [...eight.getMonthHideGan()]),
    pillar("日", eight.getDayGan(), eight.getDayZhi(), [...eight.getDayHideGan()]),
  ]
  if (hourKnown) {
    pillars.push(pillar("时", eight.getTimeGan(), eight.getTimeZhi(), [...eight.getTimeHideGan()]))
  }

  const scores: ElementScore = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  for (const item of pillars) {
    const stemWeight = item.label === "日" ? 0 : 1
    add(scores, item.ganElement, stemWeight)
    const branchWeight = item.label === "月" ? 2.6 : 1
    item.hide.forEach((gan, index) => {
      add(scores, STEM_ELEMENT[gan], branchWeight * (HIDE_WEIGHT[index] ?? 0.15))
    })
  }

  const dayMaster = eight.getDayGan()
  const dayElement = STEM_ELEMENT[dayMaster]
  const support = scores[dayElement] + scores[generatedBy(dayElement)]
  const pressure =
    scores[generates(dayElement)] + scores[controls(dayElement)] + scores[controlledBy(dayElement)]
  const strong = support >= pressure
  const monthZhi = eight.getMonthZhi()
  const total = Object.values(scores).reduce((sum, n) => sum + n, 0) || 1
  const average = total / 5
  let climate: Element | null = null
  if ("亥子丑".includes(monthZhi) && scores.火 < average) climate = "火"
  if ("巳午未".includes(monthZhi) && scores.水 < average) climate = "水"

  const scarce = (list: Element[]) =>
    [...list].sort((a, b) => scores[a] - scores[b] || a.localeCompare(b, "zh"))

  const supportive = scarce([generatedBy(dayElement), dayElement])
  const expressive = scarce([generates(dayElement), controls(dayElement), controlledBy(dayElement)])
  const yong: Element[] = []
  const push = (element: Element) => {
    if (!yong.includes(element)) yong.push(element)
  }
  if (climate) push(climate)
  for (const element of strong ? expressive : supportive) push(element)
  const yongFinal = yong.slice(0, 3)
  const ji = (["木", "火", "土", "金", "水"] as Element[]).filter((element) => !yongFinal.includes(element))

  const baziAnimal = BRANCH_ANIMAL[eight.getYearZhi()]
  const folkAnimal = lunar.getYearShengXiao()
  const animalNote =
    baziAnimal === folkAnimal
      ? `生肖与年柱同为${folkAnimal}。年柱以立春为界，生肖以春节为界。`
      : `春节生肖为${folkAnimal}，立春年柱为${baziAnimal}。起名避冲按春节生肖，八字五行按年柱。`

  const monthElement = BRANCH_ELEMENT[monthZhi]
  const inCommand = monthElement === dayElement
  const commandGenerates = generates(monthElement) === dayElement
  const strengthLabel = strong ? "身旺" : "身弱"
  const missing = (["木", "火", "土", "金", "水"] as Element[]).filter((element) => scores[element] < 0.4)
  const commandText = inCommand
    ? "月令与日主同气，得令。"
    : commandGenerates
      ? "月令生日主，得生。"
      : "月令不助日主。"
  const summary = [
    `日主${dayMaster}${dayElement}，生在${monthZhi}月，${commandText}综合看是${strengthLabel}。`,
    strong
      ? "扶抑取泄、耗、克，让力量有去处。"
      : "扶抑取生我与同我，先把日主托住。",
    climate ? `${"亥子丑".includes(monthZhi) ? "冬月" : "夏月"}调候先取${climate}。` : "",
    missing.length ? `盘面几乎不见${missing.join("、")}。只补落在喜用里的缺，不把忌神补进来。` : "",
    `喜用${yongFinal.join("、")}，忌神${ji.join("、")}。`,
    !hourKnown ? "未定时辰，时柱不入五行。" : hour >= 23 ? "晚子时，日柱按次日。" : "",
  ]
    .filter(Boolean)
    .join("")

  return {
    pillars,
    dayMaster,
    dayElement,
    yearBranch: eight.getYearZhi(),
    baziAnimal,
    folkAnimal,
    animalNote,
    scores,
    strong,
    strengthLabel,
    yong: yongFinal,
    ji,
    climate,
    summary,
    hourKnown,
    nayin: [
      eight.getYearNaYin(),
      eight.getMonthNaYin(),
      eight.getDayNaYin(),
      hourKnown ? eight.getTimeNaYin() : "",
    ].filter(Boolean),
  }
}
