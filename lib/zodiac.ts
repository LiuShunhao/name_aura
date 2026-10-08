export type Animal =
  | "鼠"
  | "牛"
  | "虎"
  | "兔"
  | "龙"
  | "蛇"
  | "马"
  | "羊"
  | "猴"
  | "鸡"
  | "狗"
  | "猪"

const HARD: Record<Animal, string[]> = {
  鼠: ["午", "马"],
  牛: ["未", "羊"],
  虎: ["申", "猴"],
  兔: ["酉", "鸡"],
  龙: ["戌", "狗"],
  蛇: ["亥", "猪"],
  马: ["子", "鼠"],
  羊: ["丑", "牛"],
  猴: ["寅", "虎"],
  鸡: ["卯", "兔"],
  狗: ["辰", "龙"],
  猪: ["巳", "蛇"],
}

const SOFT: Record<Animal, string[]> = {
  鼠: ["日", "火", "阳"],
  牛: ["心"],
  虎: ["口", "门"],
  兔: ["刀"],
  龙: ["小"],
  蛇: ["日"],
  马: ["氵"],
  羊: ["心"],
  猴: ["田"],
  鸡: ["心"],
  狗: ["火", "日"],
  猪: ["刀", "石"],
}

const FAVOR: Record<Animal, string[]> = {
  鼠: ["米", "豆", "氵", "金", "玉", "月"],
  牛: ["艹", "木", "豆", "米"],
  虎: ["山", "林", "木", "王"],
  兔: ["艹", "木", "月", "玉"],
  龙: ["水", "雨", "云", "日", "月"],
  蛇: ["艹", "木", "虫"],
  马: ["艹", "木", "金", "玉"],
  羊: ["艹", "木", "金", "玉"],
  猴: ["木", "金", "玉", "人"],
  鸡: ["米", "豆", "木", "月"],
  狗: ["人", "月", "鱼", "金", "玉"],
  猪: ["豆", "米", "氵", "月", "木"],
}

const CLASH: Record<Animal, Animal> = {
  鼠: "马",
  牛: "羊",
  虎: "猴",
  兔: "鸡",
  龙: "狗",
  蛇: "猪",
  马: "鼠",
  羊: "牛",
  猴: "虎",
  鸡: "兔",
  狗: "龙",
  猪: "蛇",
}

const HE: Record<Animal, Animal> = {
  鼠: "牛",
  牛: "鼠",
  虎: "猪",
  猪: "虎",
  兔: "狗",
  狗: "兔",
  龙: "鸡",
  鸡: "龙",
  蛇: "猴",
  猴: "蛇",
  马: "羊",
  羊: "马",
}

export function zodiacProfile(animal: string) {
  const key = animal as Animal
  return {
    animal: key,
    hard: HARD[key] ?? [],
    soft: SOFT[key] ?? [],
    favor: FAVOR[key] ?? [],
    clash: CLASH[key],
    harmony: HE[key],
  }
}

export function glyphHits(parts: string[], needles: string[]): string[] {
  const blob = parts.join("")
  return needles.filter((item) => blob.includes(item))
}
