import { castChart, type Chart } from "@/lib/bazi"
import type { Element } from "@/lib/elements"
import { GLYPHS, type Glyph } from "@/lib/lexicon"
import { industryById, type Industry } from "@/lib/industries"
import { finalOf, initialOf, isPing, toneMark } from "@/lib/pinyin"
import { COMPOUND_SURNAMES, SURNAME_GLYPH, type SurnameGlyph } from "@/lib/surnames"
import { computeWuge, readWuge, type WugeReading } from "@/lib/wuge"
import { glyphHits, zodiacProfile } from "@/lib/zodiac"

export type Gender = "m" | "f" | "n"
export type NameMode = "child" | "brand"

export type NameRequest = {
  mode: NameMode
  surname?: string
  gender?: Gender
  year?: number
  month?: number
  day?: number
  hour?: number
  minute?: number
  givenLength: 1 | 2 | 3
  styles: string[]
  prefer?: string
  avoid?: string
  industryId?: string
  seed?: number
  strokeOverrides?: Record<string, number>
}

export type ScoreSet = {
  element: number
  wuge: number
  sound: number
  wing: number
  mind: number
  total: number
}

export type ProposedName = {
  text: string
  given: string
  pinyin: string
  chars: Array<Glyph | SurnameGlyph & { c: string; sense?: string; role?: string; struct?: string }>
  givenChars: Glyph[]
  scores: ScoreSet
  wuge: WugeReading
  elementNote: string
  soundNote: string
  wingNote: string
  mindNote: string
  zodiacNote: string
  narrative: string
  slogan: string
  positioning: string
}

export type Proposal = {
  names: ProposedName[]
  chart: Chart | null
  industry: Industry | null
  yong: Element[]
  ji: Element[]
  notes: string[]
  error?: string
}

const BAD_CHARS = "死丧病苦恨惨败穷鬼哭凶灾祸亡坟墓煞尸屎傻骚贱淫赌毒偷抢骗"
const BAD_PY = ["siwang", "sangming", "shabi", "caosi", "daomei", "wangba", "hundan", "baichi"]
const BLOCKED_BRANDS = new Set(["华为", "阿里", "腾讯", "百度", "小米", "谷歌", "微软", "茅台", "字节", "美团"])

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function hash(text: string): number {
  let value = 0
  for (const char of text) value = (value * 33 + char.charCodeAt(0)) >>> 0
  return value
}

export function splitSurname(raw: string): string[] {
  const text = raw.trim()
  const compound = COMPOUND_SURNAMES.find((item) => text.startsWith(item))
  if (compound && text.length === compound.length) return [...compound]
  return [...text]
}

export function resolveSurname(
  raw: string,
  overrides: Record<string, number> = {},
): { glyphs: Array<SurnameGlyph & { c: string }>; error?: string } {
  const text = raw.trim()
  if (!text) return { glyphs: [], error: "先写姓氏。" }
  if (text.length > 2) return { glyphs: [], error: "姓氏请填一个字，或欧阳、司马这样的复姓。" }
  const chars = splitSurname(text)
  const glyphs: Array<SurnameGlyph & { c: string }> = []
  for (const char of chars) {
    const known = SURNAME_GLYPH[char]
    const override = overrides[char]
    if (!known && !override) {
      return { glyphs: [], error: `字库里还没有「${char}」的康熙笔画，请补上后再排。` }
    }
    glyphs.push({
      c: char,
      kx: override || known?.kx || 1,
      wx: known?.wx || "土",
      py: known?.py || "",
      tone: known?.tone || 1,
    })
  }
  return { glyphs }
}

function allowsGender(glyph: Glyph, gender: Gender | undefined, mode: NameMode): boolean {
  if (mode === "brand") return true
  if (glyph.gender === "b") return false
  if (!gender || gender === "n") return true
  if (gender === "m") return glyph.gender === "m" || glyph.gender === "n"
  return glyph.gender === "f" || glyph.gender === "n"
}

function combinations(pool: Glyph[], length: number): Glyph[][] {
  const out: Glyph[][] = []
  if (length === 1) return pool.map((item) => [item])
  if (length === 2) {
    for (let i = 0; i < pool.length; i++) {
      for (let j = 0; j < pool.length; j++) {
        if (i === j) continue
        out.push([pool[i], pool[j]])
      }
    }
    return out
  }
  const seeds = pool.length > 42 ? pool.slice(0, 42) : pool
  for (const a of seeds) {
    for (const b of seeds) {
      if (a.c === b.c) continue
      for (const c of seeds) {
        if (c.c === a.c || c.c === b.c) continue
        out.push([a, b, c])
      }
    }
  }
  return out
}

function elementScore(chars: Glyph[], yong: Element[], ji: Element[]): { score: number; note: string } {
  if (yong.length === 0) return { score: 70, note: "尚未设定喜用，五行只作参考。" }
  const used = chars.map((item) => item.wx)
  const hits = used.filter((item) => yong.includes(item)).length
  let score = 28 + hits * 26
  if (used.includes(yong[0])) score += 12
  const jiHits = used.filter((item) => ji.includes(item) && !yong.includes(item)).length
  score -= jiHits * 10
  const covered = [...new Set(used.filter((item) => yong.includes(item)))]
  const note =
    covered.length > 0
      ? `用字落入喜用的${covered.join("、")}。`
      : "这些字还没有落到喜用上，这一轮只作备选。"
  return { score: clamp(score), note }
}

function soundScore(tones: number[], pinyins: string[]): { score: number; note: string } {
  let score = 68
  const notes: string[] = []
  const ping = tones.filter((tone) => isPing(tone)).length
  if (new Set(tones).size === 1) {
    score -= 26
    notes.push("声调完全相同")
  } else if (ping > 0 && ping < tones.length) {
    score += 14
    notes.push("平仄错开")
  }
  const initials = pinyins.filter(Boolean).map(initialOf)
  if (initials.length > 1 && new Set(initials).size === initials.length) {
    score += 8
    notes.push("声母各不相同")
  } else if (initials.length > 1) {
    score -= 8
    notes.push("声母相重")
  }
  const finals = pinyins.filter(Boolean).map(finalOf)
  if (finals.length > 1 && new Set(finals).size === 1) score -= 8
  const pattern = tones
    .map((tone) => (isPing(tone) ? "平" : "仄"))
    .join("")
  return { score: clamp(score), note: `${pattern || "声调不全"}。${notes.join("，") || "读音平稳"}。` }
}

function wingScore(chars: Glyph[]): { score: number; note: string } {
  if (chars.length < 2) {
    return {
      score: chars[0]?.role === "both" ? 80 : 72,
      note: "单名把字根和意象收在同一个字里。",
    }
  }
  let score = 62
  const notes: string[] = []
  const rooted = chars.some((item) => item.role === "root" || item.role === "both")
  const winged = chars.some((item) => item.role === "wing" || item.role === "both")
  if (rooted && winged) {
    score += 16
    notes.push("一个字承德行，一个字取气象")
  }
  if (new Set(chars.map((item) => item.struct)).size > 1) {
    score += 12
    notes.push(`字形分别是${chars.map((item) => item.struct).join("与")}`)
  } else {
    notes.push("字形结构相近")
  }
  const shared = chars[0].themes.filter((theme) => chars[1].themes.includes(theme))
  if (shared.length) {
    score += 8
    notes.push(`两边的意象都落在「${shared[0]}」上`)
  }
  return { score: clamp(score), note: `${notes.join("，")}。` }
}

function mindScore(
  chars: Glyph[],
  gender: Gender | undefined,
  industry: Industry | null,
  animalNote: string,
): { score: number; note: string } {
  let score = 70
  const notes: string[] = []
  if (chars.every((item) => item.freq === 1)) {
    score -= 10
    notes.push("这几个字都很常见，要靠组合才好记")
  } else if (chars.some((item) => item.freq === 3)) {
    score += 8
    notes.push("有一个稍少见的字，名字更站得住")
  }
  const plain = new Set(["木", "金", "石", "田", "火", "土"])
  if (chars.some((item) => plain.has(item.c))) {
    score -= 14
    notes.push("有一个字太像偏旁，名字显得没收住")
  }
  if (gender === "m" || gender === "f") {
    const fit = chars.every((item) => item.gender === gender || item.gender === "n")
    if (fit) score += 6
  }
  if (industry) {
    const tagged = chars.filter((item) => item.industries.includes(industry.id)).length
    score += Math.min(16, tagged * 8)
    const countWord = ["", "一", "两", "三"][tagged] ?? String(tagged)
    notes.push(tagged ? `有${countWord}个字直接对应「${industry.name}」` : "行业的感觉来自五行和语气，不靠字面堆砌")
  }
  return { score: clamp(score), note: `${notes.join("，") || "寓意都偏于正面"}。${animalNote}` }
}

function weighted(scores: Omit<ScoreSet, "total">, mode: NameMode): number {
  const weights =
    mode === "brand"
      ? { element: 0.22, wuge: 0.15, sound: 0.22, wing: 0.16, mind: 0.25 }
      : { element: 0.3, wuge: 0.25, sound: 0.15, wing: 0.15, mind: 0.15 }
  return clamp(
    scores.element * weights.element +
      scores.wuge * weights.wuge +
      scores.sound * weights.sound +
      scores.wing * weights.wing +
      scores.mind * weights.mind,
  )
}

export function proposeNames(request: NameRequest): Proposal {
  const notes: string[] = []
  const industry = request.mode === "brand" && request.industryId ? industryById(request.industryId) : null
  let chart: Chart | null = null
  if (request.year && request.month && request.day) {
    chart = castChart({
      year: request.year,
      month: request.month,
      day: request.day,
      hour: request.hour,
      minute: request.minute,
    })
  } else if (request.mode === "child") {
    return { names: [], chart: null, industry, yong: [], ji: [], notes, error: "新生儿起名需要公历生日。" }
  }

  let surname: Array<SurnameGlyph & { c: string }> = []
  if (request.mode === "child") {
    const resolved = resolveSurname(request.surname || "", request.strokeOverrides)
    if (resolved.error) return { names: [], chart, industry, yong: chart?.yong ?? [], ji: chart?.ji ?? [], notes, error: resolved.error }
    surname = resolved.glyphs
  }

  const yong: Element[] = []
  const pushYong = (element: Element) => {
    if (!yong.includes(element)) yong.push(element)
  }
  if (chart) chart.yong.forEach(pushYong)
  if (industry) industry.elements.forEach(pushYong)
  const yongFinal = yong.slice(0, 3)
  const ji = chart?.ji.filter((item) => !yongFinal.includes(item)) ?? []
  if (chart && industry) {
    const overlap = chart.yong.filter((item) => industry.elements.includes(item))
    notes.push(
      overlap.length
        ? `创始人的喜用与「${industry.name}」重合于${overlap.join("、")}。`
        : `创始人喜用为${chart.yong.join("、")}，行业偏向${industry.elements.join("、")}。名字先保住喜用，再让语气靠近行业。`,
    )
  }
  if (!chart && industry) notes.push(`没有填写生辰，五行按「${industry.name}」的行业属性，取${industry.elements.join("、")}。`)

  const animal = chart ? zodiacProfile(chart.folkAnimal) : null
  const avoid = new Set([...(request.avoid || "")].filter((item) => item.trim()))
  const prefer = (request.prefer || "").trim()
  if (prefer && ![...prefer].every((item) => GLYPHS.some((glyph) => glyph.c === item))) {
    return {
      names: [],
      chart,
      industry,
      yong: yongFinal,
      ji,
      notes,
      error: `希望用到的「${prefer}」不在当前字库里，请换一个字，或留空。`,
    }
  }

  const styleSet = new Set(request.styles)
  let pool = GLYPHS.filter((glyph) => allowsGender(glyph, request.gender, request.mode))
  pool = pool.filter((glyph) => !avoid.has(glyph.c))
  if (animal) {
    pool = pool.filter((glyph) => glyphHits([glyph.c, ...glyph.parts], animal.hard).length === 0)
  }
  if (request.mode === "brand" && industry && pool.length > 36) {
    const biased = pool.filter(
      (glyph) => glyph.industries.includes(industry.id) || yongFinal.includes(glyph.wx) || glyph.gender !== "b",
    )
    if (biased.length >= 24) pool = biased
  }

  const length = request.mode === "child" ? (request.givenLength === 1 ? 1 : 2) : request.givenLength === 3 ? 3 : 2
  const primary = chart ? chart.yong : industry?.elements ?? yongFinal

  const build = (relax: number) => {
    let source = pool
    if (styleSet.size && relax < 1) {
      const styled = source.filter((glyph) => glyph.styles.some((style) => styleSet.has(style)))
      if (styled.length >= 12) source = styled
    }
    const found: ProposedName[] = []
    for (const given of combinations(source, length)) {
      if (prefer && !given.some((item) => prefer.includes(item.c))) continue
      if (animal && given.some((item) => glyphHits([item.c, ...item.parts], animal.hard).length)) continue
      const wuge = readWuge(
        computeWuge(
          request.mode === "child" ? surname.map((item) => item.kx) : [given[0].kx],
          request.mode === "child" ? given.map((item) => item.kx) : given.slice(1).map((item) => item.kx),
        ),
      )
      if (wuge.blocked) continue
      if (relax < 2 && wuge.readings.some((item) => (item.key === "ren" || item.key === "zong") && item.level === "凶")) {
        continue
      }
      if (relax < 3 && primary.length && !given.some((item) => primary.includes(item.wx))) continue
      const text = `${surname.map((item) => item.c).join("")}${given.map((item) => item.c).join("")}`
      if ([...text].some((item) => BAD_CHARS.includes(item))) continue
      if (request.mode === "brand" && BLOCKED_BRANDS.has(text)) continue
      const pinyinParts = [
        ...surname.map((item) => (item.py ? toneMark(item.py, item.tone) : "")),
        ...given.map((item) => toneMark(item.py, item.tone)),
      ].filter(Boolean)
      const bare = [...surname.map((item) => item.py), ...given.map((item) => item.py)].filter(Boolean).join("")
      if (BAD_PY.some((item) => bare.includes(item))) continue
      const tones = [...surname.map((item) => item.tone), ...given.map((item) => item.tone)].filter((item) => item > 0)
      const element = elementScore(given, primary.length ? primary : yongFinal, ji)
      const sound = soundScore(tones, [...surname.map((item) => item.py), ...given.map((item) => item.py)])
      const wing = wingScore(given)
      const soft = animal ? glyphHits(given.flatMap((item) => [item.c, ...item.parts]), animal.soft) : []
      const favor = animal ? glyphHits(given.flatMap((item) => [item.c, ...item.parts]), animal.favor) : []
      let zodiacScore = 76
      if (soft.length) zodiacScore -= 14
      if (favor.length) zodiacScore += 10
      const zodiacNote = animal
        ? `生肖为${animal.animal}，已避开与${animal.clash}相冲的字根${animal.hard.join("、")}。${
            soft.length ? `含有宜少用的${soft.join("、")}，分数略降。` : ""
          }${favor.length ? `字形里有宜用的${favor.join("、")}。` : ""}`
        : "品牌名不按生肖避冲，除非填写了创始人的生辰。"
      const mind = mindScore(given, request.gender, industry, "")
      mind.score = clamp(mind.score * 0.72 + zodiacScore * 0.28)
      const scoresNoTotal = {
        element: element.score,
        wuge: wuge.score,
        sound: sound.score,
        wing: wing.score,
        mind: mind.score,
      }
      const scores = { ...scoresNoTotal, total: weighted(scoresNoTotal, request.mode) }
      const narrative = narrate({
        text,
        given,
        chart,
        industry,
        scores,
        wuge,
        element: element.note,
        sound: sound.note,
        wing: wing.note,
      })
      found.push({
        text,
        given: given.map((item) => item.c).join(""),
        pinyin: pinyinParts.join(" "),
        chars: [...surname, ...given],
        givenChars: given,
        scores,
        wuge,
        elementNote: element.note,
        soundNote: sound.note,
        wingNote: wing.note,
        mindNote: mind.note,
        zodiacNote: zodiacNote,
        narrative,
        slogan: sloganFor(given, industry),
        positioning: industry
          ? `${industry.voice}。${industry.promise}。`
          : chart
            ? `${chart.strengthLabel}，喜用${chart.yong.join("、")}。`
            : "",
      })
    }
    return found
  }

  let found: ProposedName[] = []
  const relaxLabels = [
    "",
    "风格已经放宽，仍遵守喜用，并排除大凶。",
    "人格或总格为「凶」的，不再一概排除；大凶仍然排除。",
    "喜用覆盖不足，这一批只供对照，不宜作为首选。",
  ]
  for (let relax = 0; relax < 4 && found.length < 8; relax++) {
    found = build(relax)
    if (found.length >= 8) {
      if (relaxLabels[relax]) notes.push(relaxLabels[relax])
      break
    }
  }
  if (found.length === 0) {
    return { names: [], chart, industry, yong: yongFinal, ji, notes, error: "按目前的条件，没有可推荐的名字。请放宽风格，或换一个希望用到的字。" }
  }
  if (found.length < 8) notes.push("符合条件的名字不足八个，下面是全部结果。")

  const seed = request.seed ?? 0
  found.sort((a, b) => b.scores.total - a.scores.total || hash(a.text) - hash(b.text))
  const ordered: ProposedName[] = []
  const seenText = new Set<string>()
  for (const item of found) {
    if (seenText.has(item.text)) continue
    seenText.add(item.text)
    ordered.push(item)
  }

  const batches: ProposedName[][] = []
  const reserved = new Set<string>()
  const globalUse = new Map<string, number>()
  const givenChars = (item: ProposedName) => item.givenChars.map((glyph) => glyph.c)

  function take(maxUsed: number, batch: ProposedName[], local: Set<string>) {
    for (const item of ordered) {
      if (batch.length === 8) return
      if (reserved.has(item.text)) continue
      const chars = givenChars(item)
      if (new Set(chars).size !== chars.length) continue
      if (chars.some((char) => local.has(char))) continue
      if (chars.some((char) => (globalUse.get(char) ?? 0) > maxUsed)) continue
      batch.push(item)
      for (const char of chars) local.add(char)
    }
  }

  for (let round = 0; round < 8; round++) {
    const batch: ProposedName[] = []
    const local = new Set<string>()
    take(0, batch, local)
    if (batch.length < 8) take(round, batch, local)
    if (batch.length === 0) break
    batches.push(batch)
    for (const item of batch) {
      reserved.add(item.text)
      for (const char of givenChars(item)) globalUse.set(char, (globalUse.get(char) ?? 0) + 1)
    }
  }

  const picked = batches.length ? batches[seed % batches.length] : []
  if (seed > 0 && batches.length > 1 && seed % batches.length !== 0) {
    notes.push("这一批换过用字，不与上一批重复。")
  }

  return { names: picked, chart, industry, yong: yongFinal, ji, notes }
}

function narrate(input: {
  text: string
  given: Glyph[]
  chart: Chart | null
  industry: Industry | null
  scores: ScoreSet
  wuge: WugeReading
  element: string
  sound: string
  wing: string
}): string {
  const gloss = input.given.map((item) => `${item.c}，${item.sense}`).join("；")
  const ren = input.wuge.readings.find((item) => item.key === "ren")
  const zong = input.wuge.readings.find((item) => item.key === "zong")
  const chartLine = input.chart
    ? `日主为${input.chart.dayMaster}${input.chart.dayElement}，${input.chart.strengthLabel}，喜用${input.chart.yong.join("、")}。`
    : input.industry
      ? `品牌属于「${input.industry.name}」，五行取${input.industry.elements.join("、")}。`
      : ""
  return `${input.text}。${gloss}。${chartLine}${input.element}${input.wing}${input.sound}人格为${ren?.strokes}画，${ren?.level}；总格为${zong?.strokes}画，${zong?.level}。综合${input.scores.total}分。`
}

function sloganFor(chars: Glyph[], industry: Industry | null): string {
  const theme = chars.map((item) => item.themes[0]).filter(Boolean).slice(0, 2).join("与")
  if (!industry) return theme ? `取意于${theme}` : chars.map((item) => item.sense).join("，")
  return `${chars.map((item) => item.c).join("")}，${theme || industry.voice}`
}
