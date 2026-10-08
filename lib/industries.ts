import type { Element } from "@/lib/elements"

export type Industry = {
  id: string
  name: string
  elements: Element[]
  voice: string
  promise: string
}

export const INDUSTRIES: Industry[] = [
  { id: "tech", name: "科技与互联网", elements: ["火", "水"], voice: "清楚、向前", promise: "把复杂变成可被使用的秩序" },
  { id: "ai", name: "人工智能", elements: ["金", "火"], voice: "精确、有温度", promise: "让判断看得见，也让人放得下心" },
  { id: "finance", name: "金融与专业服务", elements: ["金", "水"], voice: "克制、可信", promise: "把信任做成可以交接的东西" },
  { id: "edu", name: "教育与出版", elements: ["木", "水"], voice: "启明、耐读", promise: "让一个人慢慢变清楚" },
  { id: "food", name: "餐饮与食品", elements: ["土", "火"], voice: "温暖、有味道", promise: "一口就记得住的日常" },
  { id: "health", name: "医疗与健康", elements: ["木", "水"], voice: "安稳、干净", promise: "把身体交还给平衡" },
  { id: "estate", name: "空间与地产", elements: ["土", "金"], voice: "落定、有边界", promise: "让人愿意把生活放进来" },
  { id: "fashion", name: "服饰与美学", elements: ["木", "火"], voice: "克制的明亮", promise: "穿上之后，人先被记得" },
  { id: "baby", name: "母婴与家庭", elements: ["木", "水"], voice: "柔软、安心", promise: "生长被轻轻托住" },
  { id: "law", name: "法律与咨询", elements: ["金", "水"], voice: "明白、有尺度", promise: "把纷乱说成可以执行的话" },
  { id: "energy", name: "能源与制造", elements: ["火", "金"], voice: "有力、耐用", promise: "让能量被好好用掉" },
  { id: "agri", name: "农业与自然", elements: ["木", "土"], voice: "土地气、不喧哗", promise: "从土里长出可信任的产出" },
  { id: "media", name: "文化与传媒", elements: ["火", "水"], voice: "有观点、听得清", promise: "一句就能被转述" },
  { id: "jewel", name: "珠宝与礼品", elements: ["金", "土"], voice: "分量、余味", promise: "小物件里留下长一点的光" },
  { id: "tea", name: "茶酒与器物", elements: ["木", "水"], voice: "清、慢、有出处", promise: "把山水收成一杯或一件" },
]

export const STYLES = ["古典", "清雅", "明朗", "书卷", "灵动", "大气", "温润"] as const
export type StyleName = (typeof STYLES)[number]

export function industryById(id: string): Industry {
  return INDUSTRIES.find((item) => item.id === id) ?? INDUSTRIES[0]
}
