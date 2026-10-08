const MARKS: Record<string, string[]> = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  v: ["ǖ", "ǘ", "ǚ", "ǜ"],
  ü: ["ǖ", "ǘ", "ǚ", "ǜ"],
}

function placeTone(syllable: string, tone: number): string {
  if (tone < 1 || tone > 4) return syllable
  const chars = syllable.replaceAll("v", "ü").split("")
  const vowels = chars
    .map((char, index) => ({ char, index }))
    .filter((item) => "aeiouü".includes(item.char))
  if (vowels.length === 0) return syllable
  let target = vowels[vowels.length - 1].index
  const text = chars.join("")
  if (text.includes("a")) target = chars.indexOf("a")
  else if (text.includes("e")) target = chars.indexOf("e")
  else if (text.includes("ou")) target = chars.indexOf("o")
  else if (text.includes("iu")) target = text.lastIndexOf("u")
  else if (text.includes("ui")) target = text.lastIndexOf("i")
  const marked = MARKS[chars[target]]
  if (!marked) return text
  chars[target] = marked[tone - 1]
  return chars.join("")
}

export function toneMark(pinyin: string, tone: number): string {
  return pinyin
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((part) => placeTone(part, tone))
    .join(" ")
}

export function initialOf(pinyin: string): string {
  const match = pinyin
    .toLowerCase()
    .match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])/)
  return match?.[1] ?? pinyin.slice(0, 1)
}

export function finalOf(pinyin: string): string {
  return pinyin.toLowerCase().replace(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])/, "")
}

export function isPing(tone: number): boolean {
  return tone === 1 || tone === 2
}
