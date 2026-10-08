declare module "lunar-javascript" {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar
    getLunar(): Lunar
  }

  export class Lunar {
    getYearShengXiao(): string
    getEightChar(): EightChar
  }

  export class EightChar {
    setSect(sect: number): void
    getYearGan(): string
    getYearZhi(): string
    getMonthGan(): string
    getMonthZhi(): string
    getDayGan(): string
    getDayZhi(): string
    getTimeGan(): string
    getTimeZhi(): string
    getYearHideGan(): string[]
    getMonthHideGan(): string[]
    getDayHideGan(): string[]
    getTimeHideGan(): string[]
    getYearNaYin(): string
    getMonthNaYin(): string
    getDayNaYin(): string
    getTimeNaYin(): string
  }
}
