import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { castChart } from "./bazi"
import { proposeNames } from "./naming"
import { SHULI } from "./numerology"
import { readWuge, computeWuge } from "./wuge"

describe("bazi anchors", () => {
  it("keeps the noon pillar of 2000-01-01", () => {
    const chart = castChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0 })
    const text = chart.pillars.map((item) => item.gan + item.zhi).join(" ")
    assert.equal(text, "己卯 丙子 戊午 戊午")
    assert.equal(chart.dayMaster, "戊")
    assert.equal(chart.folkAnimal, "兔")
  })

  it("matches the 1985-03-12 you hour case", () => {
    const chart = castChart({ year: 1985, month: 3, day: 12, hour: 18, minute: 0 })
    const text = chart.pillars.map((item) => item.gan + item.zhi).join(" ")
    assert.equal(text, "乙丑 己卯 庚戌 乙酉")
  })

  it("splits lunar zodiac from lichun year pillar in early February 2024", () => {
    const chart = castChart({ year: 2024, month: 2, day: 6, hour: 8, minute: 0 })
    assert.equal(chart.pillars[0].gan + chart.pillars[0].zhi, "甲辰")
    assert.equal(chart.folkAnimal, "兔")
    assert.equal(chart.baziAnimal, "龙")
  })

  it("moves the day pillar at 23:00", () => {
    const late = castChart({ year: 2000, month: 1, day: 1, hour: 23, minute: 30 })
    const early = castChart({ year: 2000, month: 1, day: 2, hour: 0, minute: 30 })
    assert.equal(late.pillars[2].gan + late.pillars[2].zhi, early.pillars[2].gan + early.pillars[2].zhi)
    assert.equal(late.pillars[3].gan + late.pillars[3].zhi, "甲子")
  })
})

describe("wuge", () => {
  it("uses the single-surname double-given formula", () => {
    const reading = readWuge(computeWuge([5], [8, 16]))
    assert.equal(reading.grids.tian, 6)
    assert.equal(reading.grids.ren, 13)
    assert.equal(reading.grids.di, 24)
    assert.equal(reading.grids.zong, 29)
    assert.equal(reading.grids.wai, 17)
    assert.equal(reading.blocked, false)
  })

  it("has one entry for each of the 81 numbers", () => {
    assert.equal(SHULI.length, 81)
    assert.equal(SHULI[33].level, "大凶")
    assert.equal(SHULI[80].level, "大吉")
  })
})

describe("naming", () => {
  it("returns baby names that avoid severe stroke counts", () => {
    const result = proposeNames({
      mode: "child",
      surname: "陈",
      gender: "f",
      year: 2019,
      month: 6,
      day: 18,
      hour: 9,
      minute: 30,
      givenLength: 2,
      styles: ["清雅"],
      seed: 0,
    })
    assert.equal(result.error, undefined)
    assert.ok(result.names.length >= 4)
    assert.ok(result.chart)
    for (const name of result.names) {
      assert.equal(name.text.startsWith("陈"), true)
      assert.equal(name.wuge.blocked, false)
      assert.equal(name.givenChars.length, 2)
      assert.ok(name.scores.total >= 0 && name.scores.total <= 100)
    }
    const used = result.names.flatMap((name) => name.givenChars.map((glyph) => glyph.c))
    assert.equal(new Set(used).size, used.length)
    const next = proposeNames({
      mode: "child",
      surname: "陈",
      gender: "f",
      year: 2019,
      month: 6,
      day: 18,
      hour: 9,
      minute: 30,
      givenLength: 2,
      styles: ["清雅"],
      seed: 1,
    })
    const first = new Set(result.names.map((name) => name.text))
    assert.ok(next.names.every((name) => !first.has(name.text)))
  })

  it("names a tea brand without a birth chart", () => {
    const result = proposeNames({
      mode: "brand",
      industryId: "tea",
      givenLength: 2,
      styles: ["清雅"],
      seed: 1,
    })
    assert.equal(result.error, undefined)
    assert.ok(result.names.length >= 4)
    assert.equal(result.chart, null)
    assert.ok(result.names.every((name) => [...name.text].length === 2))
  })

  it("asks for strokes when the surname is unknown", () => {
    const result = proposeNames({
      mode: "child",
      surname: "𠮷",
      gender: "m",
      year: 2020,
      month: 1,
      day: 1,
      givenLength: 2,
      styles: [],
    })
    assert.match(result.error || "", /笔画/)
  })
})
