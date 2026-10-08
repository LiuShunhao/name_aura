"use client"

import { useState, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Element } from "@/lib/elements"
import { ELEMENT_TONE } from "@/lib/elements"
import { INDUSTRIES, STYLES } from "@/lib/industries"
import { proposeNames, type Gender, type NameMode, type Proposal, type ProposedName } from "@/lib/naming"

const WX: Record<Element, string> = {
  木: "#3d6b4f",
  火: "#9c2f2f",
  土: "#a67c42",
  金: "#7d746c",
  水: "#2c4f6e",
}

const SHICHEN: Array<[string, string]> = [
  ["早子", "00:30"],
  ["丑", "02:00"],
  ["寅", "04:00"],
  ["卯", "06:00"],
  ["辰", "08:00"],
  ["巳", "10:00"],
  ["午", "12:00"],
  ["未", "14:00"],
  ["申", "16:00"],
  ["酉", "18:00"],
  ["戌", "20:00"],
  ["亥", "22:00"],
  ["晚子", "23:30"],
]

type FormState = {
  mode: NameMode
  surname: string
  gender: Gender
  date: string
  time: string
  givenLength: 1 | 2
  brandLength: 2 | 3
  styles: string[]
  prefer: string
  avoid: string
  industryId: string
  founderDate: string
  founderTime: string
  strokes: Record<string, string>
}

const INITIAL: FormState = {
  mode: "child",
  surname: "",
  gender: "n",
  date: "",
  time: "",
  givenLength: 2,
  brandLength: 2,
  styles: [],
  prefer: "",
  avoid: "",
  industryId: "tea",
  founderDate: "",
  founderTime: "",
  strokes: {},
}

function parseDate(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  return { hour: Number(match[1]), minute: Number(match[2]) }
}

export function Studio() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [seed, setSeed] = useState(0)
  const [result, setResult] = useState<Proposal | null>(null)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<ProposedName | null>(null)
  const [copied, setCopied] = useState("")

  function patch(partial: Partial<FormState>) {
    setForm((current) => ({ ...current, ...partial }))
  }

  function toggleStyle(style: string) {
    setForm((current) => ({
      ...current,
      styles: current.styles.includes(style)
        ? current.styles.filter((item) => item !== style)
        : [...current.styles, style],
    }))
  }

  function submit(next: FormState = form, nextSeed = 0) {
    const birth = next.mode === "child" ? parseDate(next.date) : parseDate(next.founderDate)
    const clock = parseTime(next.mode === "child" ? next.time : next.founderTime)
    if (next.mode === "child" && !birth) {
      setError("请填写公历生日。预产期也可以，落地后再核时辰。")
      setResult(null)
      return
    }
    const strokes: Record<string, number> = {}
    for (const [char, value] of Object.entries(next.strokes)) {
      const count = Number(value)
      if (Number.isFinite(count) && count > 0) strokes[char] = count
    }
    const proposal = proposeNames({
      mode: next.mode,
      surname: next.surname,
      gender: next.gender,
      year: birth?.year,
      month: birth?.month,
      day: birth?.day,
      hour: clock?.hour,
      minute: clock?.minute,
      givenLength: next.mode === "child" ? next.givenLength : next.brandLength,
      styles: next.styles,
      prefer: next.prefer,
      avoid: next.avoid,
      industryId: next.industryId,
      seed: nextSeed,
      strokeOverrides: strokes,
    })
    setSeed(nextSeed)
    setError(proposal.error || "")
    setResult(proposal)
    setSelected(null)
    if (!proposal.error) {
      requestAnimationFrame(() => {
        document.getElementById("reading")?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
    } catch {
      setCopied("")
    }
  }

  const future = form.date && form.date > new Date().toISOString().slice(0, 10)
  const surnameChars = [...form.surname.trim()].slice(0, 2)

  return (
    <div className="flex-1">
      <header className="border-b border-border/80">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-4 py-6 md:px-8">
          <div className="flex items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center border-2 border-[#9c2f2f] font-serif text-2xl text-[#9c2f2f]">
              名
            </div>
            <div>
              <p className="text-xs tracking-[0.35em] text-[#9c2f2f]">问名室</p>
              <h1 className="font-serif text-3xl tracking-wide text-foreground md:text-4xl">青囊起名</h1>
            </div>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground sm:block">
            周易为骨，营销为翼。先看缺什么，再让声音站得住。
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <form
          className="h-fit border border-border bg-card p-4 shadow-[0_1px_0_rgba(80,50,20,0.04)] md:p-5"
          onSubmit={(event) => {
            event.preventDefault()
            submit(form, 0)
          }}
        >
          <Tabs
            value={form.mode}
            onValueChange={(value) => {
              patch({ mode: value as NameMode })
              setResult(null)
              setError("")
            }}
          >
            <TabsList className="grid h-10 w-full grid-cols-2">
              <TabsTrigger value="child">新生儿</TabsTrigger>
              <TabsTrigger value="brand">品牌</TabsTrigger>
            </TabsList>

            <TabsContent value="child" className="mt-4 space-y-4">
              <Field label="姓氏">
                <Input
                  value={form.surname}
                  maxLength={2}
                  placeholder="陈，或欧阳"
                  className="h-10"
                  onChange={(event) => patch({ surname: event.target.value })}
                />
              </Field>
              <Field label="性别">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["n", "不限"],
                      ["m", "男"],
                      ["f", "女"],
                    ] as const
                  ).map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      variant={form.gender === value ? "default" : "outline"}
                      className="h-10"
                      onClick={() => patch({ gender: value })}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </Field>
              <Field label="公历生日">
                <Input
                  type="date"
                  required
                  value={form.date}
                  className="h-10"
                  onChange={(event) => patch({ date: event.target.value })}
                />
                {future ? <p className="text-xs text-muted-foreground">这是预产期。出生后请用实际时辰再排一次。</p> : null}
              </Field>
              <Field label="出生时间">
                <Input
                  type="time"
                  value={form.time}
                  className="h-10"
                  onChange={(event) => patch({ time: event.target.value })}
                />
                <div className="flex flex-wrap gap-1.5">
                  {SHICHEN.map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      className={`border px-2 py-1 text-xs ${form.time === value ? "border-[#9c2f2f] text-[#9c2f2f]" : "border-border text-muted-foreground"}`}
                      onClick={() => patch({ time: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs leading-5 text-muted-foreground">不知时辰可以空着。晚子（23:00 后）日柱按次日。</p>
              </Field>
              <Field label="名字字数">
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" className="h-10" variant={form.givenLength === 2 ? "default" : "outline"} onClick={() => patch({ givenLength: 2 })}>
                    双名
                  </Button>
                  <Button type="button" className="h-10" variant={form.givenLength === 1 ? "default" : "outline"} onClick={() => patch({ givenLength: 1 })}>
                    单名
                  </Button>
                </div>
              </Field>
            </TabsContent>

            <TabsContent value="brand" className="mt-4 space-y-4">
              <Field label="行业">
                <select
                  className="h-10 w-full border border-input bg-transparent px-2.5 text-sm"
                  value={form.industryId}
                  onChange={(event) => patch({ industryId: event.target.value })}
                >
                  {INDUSTRIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="品牌字数">
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" className="h-10" variant={form.brandLength === 2 ? "default" : "outline"} onClick={() => patch({ brandLength: 2 })}>
                    两字
                  </Button>
                  <Button type="button" className="h-10" variant={form.brandLength === 3 ? "default" : "outline"} onClick={() => patch({ brandLength: 3 })}>
                    三字
                  </Button>
                </div>
              </Field>
              <Field label="创始人生辰，可选">
                <Input type="date" value={form.founderDate} className="h-10" onChange={(event) => patch({ founderDate: event.target.value })} />
                <Input type="time" value={form.founderTime} className="h-10" onChange={(event) => patch({ founderTime: event.target.value })} />
                <p className="text-xs leading-5 text-muted-foreground">填了之后，行业五行会和创始人喜用放在一起看。</p>
              </Field>
            </TabsContent>
          </Tabs>

          <div className="mt-4 space-y-4">
            <Field label="风格，可多选">
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`border px-2.5 py-1 text-sm ${form.styles.includes(style) ? "border-[#9c2f2f] bg-[#9c2f2f] text-[#f6f1e7]" : "border-border"}`}
                    onClick={() => toggleStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="希望用到的字">
                <Input value={form.prefer} maxLength={2} className="h-10" placeholder="可空" onChange={(event) => patch({ prefer: event.target.value })} />
              </Field>
              <Field label="避开的字">
                <Input value={form.avoid} maxLength={4} className="h-10" placeholder="可空" onChange={(event) => patch({ avoid: event.target.value })} />
              </Field>
            </div>
            {error.includes("笔画") ? (
              <Field label="补上康熙笔画">
                <div className="grid grid-cols-2 gap-2">
                  {surnameChars.map((char) => (
                    <label key={char} className="text-sm">
                      <span className="mb-1 block font-serif text-lg">{char}</span>
                      <Input
                        inputMode="numeric"
                        className="h-10"
                        placeholder="画数"
                        value={form.strokes[char] || ""}
                        onChange={(event) =>
                          patch({ strokes: { ...form.strokes, [char]: event.target.value.replace(/[^\d]/g, "") } })
                        }
                      />
                    </label>
                  ))}
                </div>
              </Field>
            ) : null}
            {error ? <p className="text-sm leading-6 text-[#9c2f2f]">{error}</p> : null}
            <div className="flex flex-col gap-2">
              <Button type="submit" className="h-11">
                起名
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => {
                  if (form.mode === "brand") {
                    const next = { ...form, industryId: "tea", styles: ["清雅"], brandLength: 2 as const }
                    setForm(next)
                    submit(next, 0)
                    return
                  }
                  const next = {
                    ...form,
                    mode: "child" as const,
                    surname: "陈",
                    gender: "f" as const,
                    date: "2019-06-18",
                    time: "09:30",
                    styles: ["清雅"],
                    givenLength: 2 as const,
                  }
                  setForm(next)
                  submit(next, 0)
                }}
              >
                填入一组示例
              </Button>
            </div>
          </div>
        </form>

        <section id="reading" className="min-w-0 space-y-4">
          {result && !result.error ? (
            <>
              <Reading result={result} />
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl">八个可取的名字</h2>
                <Button type="button" variant="outline" className="h-10" onClick={() => submit(form, seed + 1)}>
                  再取一批
                </Button>
              </div>
              {result.notes.length ? (
                <ul className="space-y-1 text-sm leading-6 text-muted-foreground">
                  {result.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {result.names.map((name) => (
                  <button
                    key={name.text}
                    type="button"
                    className="border border-border bg-card p-4 text-left transition hover:border-[#9c2f2f]"
                    onClick={() => setSelected(name)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-3xl tracking-widest">{name.text}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{name.pinyin}</p>
                      </div>
                      <span className="font-serif text-2xl text-[#9c2f2f]">{name.scores.total}</span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6">{name.narrative}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {name.givenChars.map((glyph) => (
                        <Badge key={glyph.c} variant="secondary">
                          {glyph.c} · {glyph.wx}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </section>
      </main>

      <section id="method" className="border-t border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-4 md:px-8">
          {[
            ["五行补缺", "先排八字，分身旺身弱，再取喜用。缺的元素只有落在喜用里才补，忌神不硬补。"],
            ["生肖冲合", "春节定生肖，立春定年柱。相冲的字根直接避开，宜用的偏旁加分。"],
            ["五格与大凶", "笔画用康熙部首还原。人格、地格、总格碰到三十四、四十四、五十四、六十四就不入选。"],
            ["音韵与羽翼", "平仄错开，声母不要撞车。双名一字承德行，一字负责把名字扬起来。品牌再加一句记得住的话。"],
          ].map(([title, body]) => (
            <article key={title}>
              <h2 className="font-serif text-xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <p className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs leading-5 text-muted-foreground md:px-8">
          这是一套可解释的文化计算：八字用节气，晚子时日柱进一日；五格按减八十循环的八十一数理。它帮你取舍名字，不是命运判决，也不代替商标检索。
        </p>
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-4xl tracking-[0.3em]">{selected.text}</DialogTitle>
                <DialogDescription>{selected.pinyin}</DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-7">{selected.narrative}</p>
              {selected.slogan ? <p className="font-serif text-lg text-[#9c2f2f]">{selected.slogan}</p> : null}
              {selected.positioning ? <p className="text-sm leading-6 text-muted-foreground">{selected.positioning}</p> : null}
              <div className="grid gap-2">
                {(
                  [
                    ["五行", selected.scores.element, selected.elementNote],
                    ["五格", selected.scores.wuge, selected.wuge.sancai.flow],
                    ["音韵", selected.scores.sound, selected.soundNote],
                    ["羽翼", selected.scores.wing, selected.wingNote],
                    ["心理", selected.scores.mind, selected.mindNote],
                  ] as const
                ).map(([label, score, note]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{label}</span>
                      <span>{score}</span>
                    </div>
                    <div className="h-1.5 bg-muted">
                      <div className="h-full bg-[#9c2f2f]" style={{ width: `${score}%` }} />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-6">{selected.zodiacNote}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {selected.givenChars.map((glyph) => (
                  <article key={glyph.c} className="border border-border p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-3xl">{glyph.c}</span>
                      <span className="text-sm" style={{ color: WX[glyph.wx] }}>
                        {glyph.wx} · {glyph.kx}画
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{glyph.sense}</p>
                    <p className="text-xs text-muted-foreground">
                      {glyph.role === "root" ? "字根" : glyph.role === "wing" ? "羽翼" : "根翼兼有"} · {glyph.struct} ·{" "}
                      {ELEMENT_TONE[glyph.wx]}
                    </p>
                  </article>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="py-1 pr-3 font-normal">格</th>
                      <th className="py-1 pr-3 font-normal">画</th>
                      <th className="py-1 pr-3 font-normal">数理</th>
                      <th className="py-1 font-normal">象意</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.wuge.readings.map((item) => (
                      <tr key={item.key} className="border-t border-border">
                        <td className="py-2 pr-3">{item.label}</td>
                        <td className="py-2 pr-3">{item.strokes}</td>
                        <td className="py-2 pr-3">
                          {item.index}
                          {item.level}
                        </td>
                        <td className="py-2">{item.gloss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button type="button" className="h-10" onClick={() => copy(selected.text)}>
                {copied === selected.text ? "已抄下" : "抄下这个名字"}
              </Button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border bg-card/70 p-6 md:p-10">
      <p className="text-xs tracking-[0.28em] text-[#9c2f2f]">尚未排盘</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight">把生辰或行业交过来，名字从缺处长出来。</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
        新生儿会先看到四柱、五行强弱和喜用，再给出避开大凶笔画的名字。品牌会按行业的语气来取，也可以叠上创始人的八字。点开一个名字，能看见每个字为什么在这里。
      </p>
    </div>
  )
}

function Reading({ result }: { result: Proposal }) {
  const chart = result.chart
  const max = chart ? Math.max(...Object.values(chart.scores), 1) : 1
  return (
    <div className="border border-border bg-card p-4 md:p-5">
      {chart ? (
        <>
          <div className="grid grid-cols-4 gap-2">
            {chart.pillars.map((pillar) => (
              <div key={pillar.label} className="border border-border px-2 py-3 text-center">
                <p className="text-xs text-muted-foreground">{pillar.label}柱</p>
                <p className="font-serif text-2xl">
                  {pillar.gan}
                  {pillar.zhi}
                </p>
                <p className="text-xs" style={{ color: WX[pillar.ganElement] }}>
                  {pillar.ganElement}
                  {pillar.zhiElement}
                </p>
              </div>
            ))}
            {chart.pillars.length < 4 ? (
              <div className="border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                时柱
                <p className="mt-2">未定时辰</p>
              </div>
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-7">{chart.summary}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{chart.animalNote}</p>
          <div className="mt-4 space-y-2">
            {(Object.keys(chart.scores) as Element[]).map((element) => (
              <div key={element} className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 text-sm">
                <span style={{ color: WX[element] }}>{element}</span>
                <div className="h-2 bg-muted">
                  <div className="h-full" style={{ width: `${(chart.scores[element] / max) * 100}%`, background: WX[element] }} />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">{chart.scores[element].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <p className="font-serif text-2xl">{result.industry?.name}</p>
          <p className="mt-2 text-sm leading-7">{result.industry?.promise}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {result.yong.map((element) => (
          <Badge key={element} className="text-white" style={{ background: WX[element] }}>
            喜{element}
          </Badge>
        ))}
        {result.ji.map((element) => (
          <Badge key={element} variant="outline">
            忌{element}
          </Badge>
        ))}
      </div>
    </div>
  )
}
