export const ELEMENTS = ["木", "火", "土", "金", "水"] as const
export type Element = (typeof ELEMENTS)[number]

export const ELEMENT_GENERATES: Record<Element, Element> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
}

export const ELEMENT_CONTROLS: Record<Element, Element> = {
  木: "土",
  火: "金",
  土: "水",
  金: "木",
  水: "火",
}

export function generates(from: Element): Element {
  return ELEMENT_GENERATES[from]
}

export function controls(from: Element): Element {
  return ELEMENT_CONTROLS[from]
}

export function generatedBy(element: Element): Element {
  return ELEMENTS.find((item) => ELEMENT_GENERATES[item] === element) ?? "水"
}

export function controlledBy(element: Element): Element {
  return ELEMENTS.find((item) => ELEMENT_CONTROLS[item] === element) ?? "金"
}

export type Relation = "比和" | "生出" | "生入" | "克出" | "克入"

export function relation(from: Element, to: Element): Relation {
  if (from === to) return "比和"
  if (ELEMENT_GENERATES[from] === to) return "生出"
  if (ELEMENT_GENERATES[to] === from) return "生入"
  if (ELEMENT_CONTROLS[from] === to) return "克出"
  return "克入"
}

export const ELEMENT_TONE: Record<Element, string> = {
  木: "生发、舒展",
  火: "明亮、外显",
  土: "承载、稳定",
  金: "决断、精炼",
  水: "流动、智慧",
}

export const STEM_ELEMENT: Record<string, Element> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
}

export const BRANCH_ELEMENT: Record<string, Element> = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  丑: "土",
  戌: "土",
  未: "土",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
}

export const BRANCH_ANIMAL: Record<string, string> = {
  子: "鼠",
  丑: "牛",
  寅: "虎",
  卯: "兔",
  辰: "龙",
  巳: "蛇",
  午: "马",
  未: "羊",
  申: "猴",
  酉: "鸡",
  戌: "狗",
  亥: "猪",
}
