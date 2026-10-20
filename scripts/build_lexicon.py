"""Rebuild lib/lexicon.ts and lib/surnames.ts.

Runtime code uses the checked-in TypeScript tables. This script only needs to be
run again when scripts/chars.tsv changes, and it expects a local Kangxi stroke
CSV at /tmp/word.csv (character, kangxi strokes, element, reading).
"""
import csv
from pathlib import Path

ROOT = Path("/workspace")
CSV = Path("/tmp/word.csv")
TSV = ROOT / "scripts" / "chars.tsv"
CITE = ROOT / "scripts" / "citations.tsv"

rows = {}
if CSV.exists():
    with CSV.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            rows[row["字"]] = row

# 姓名学通行康熙笔画 / 五行。CSV 未收的字在此补上。
MANUAL = {
    "之": (3, "火", "zhi", 1),
    "涵": (12, "水", "han", 2),
    "源": (14, "水", "yuan", 2),
    "湛": (13, "水", "zhan", 4),
    "昊": (8, "火", "hao", 4),
    "璟": (17, "木", "jing", 3),
    "升": (4, "金", "sheng", 1),
    "柏": (9, "木", "bai", 3),
    "妍": (7, "水", "yan", 2),
    "妤": (7, "水", "yu", 2),
    "荷": (13, "木", "he", 2),
    "君": (7, "木", "jun", 1),
    "止": (4, "火", "zhi", 3),
    "芷": (10, "木", "zhi", 3),
    "芊": (9, "木", "qian", 1),
    "汐": (7, "水", "xi", 1),
    "杨": (13, "木", "yang", 2),
    "谢": (17, "金", "xie", 4),
    "牛": (4, "木", "niu", 2),
    "狐": (8, "水", "hu", 2),
    "轩": (10, "土", "xuan", 1),
    "宁": (14, "火", "ning", 2),
    "义": (13, "木", "yi", 4),
    "礼": (18, "火", "li", 3),
    "诚": (14, "金", "cheng", 2),
    "德": (15, "火", "de", 2),
    "齐": (14, "金", "qi", 2),
    "见": (7, "木", "jian", 4),
    "贤": (15, "木", "xian", 2),
    "华": (14, "水", "hua", 2),
    "泽": (17, "水", "ze", 2),
    "远": (17, "土", "yuan", 3),
    "宽": (15, "木", "kuan", 1),
    "达": (16, "火", "da", 2),
    "让": (24, "火", "rang", 4),
    "书": (10, "金", "shu", 1),
    "怀": (19, "水", "huai", 2),
    "谦": (17, "木", "qian", 1),
    "节": (15, "金", "jie", 2),
    "圆": (13, "土", "yuan", 2),
    "扬": (13, "火", "yang", 2),
    "绣": (19, "水", "xiu", 4),
    "绮": (17, "木", "qi", 3),
    "飞": (9, "水", "fei", 1),
    "乔": (12, "木", "qiao", 2),
    "栋": (12, "木", "dong", 4),
    "荣": (14, "木", "rong", 2),
    "静": (16, "金", "jing", 4),
    "兰": (23, "木", "lan", 2),
    "莲": (17, "木", "lian", 2),
    "灵": (24, "火", "ling", 2),
    "颖": (16, "木", "ying", 3),
    "词": (19, "木", "ci", 2),
    "韵": (19, "土", "yun", 4),
    "云": (12, "水", "yun", 2),
    "风": (9, "水", "feng", 1),
    "听": (22, "火", "ting", 1),
    "极": (13, "木", "ji", 2),
    "园": (13, "土", "yuan", 2),
    "丰": (18, "水", "feng", 1),
    "联": (17, "火", "lian", 2),
    "织": (18, "火", "zhi", 1),
    "纹": (13, "水", "wen", 2),
    "筑": (16, "木", "zhu", 4),
    "归": (18, "水", "gui", 1),
    "诺": (16, "火", "nuo", 4),
    "萱": (15, "木", "xuan", 1),
    "叶": (15, "土", "ye", 4),
    "鸿": (17, "水", "hong", 2),
    "鹤": (21, "水", "he", 4),
    "济": (17, "水", "ji", 4),
    "蒋": (17, "木", "jiang", 3),
    "杜": (7, "木", "du", 4),
    "吕": (7, "火", "lv", 3),
    "姚": (9, "土", "yao", 2),
    "汪": (8, "水", "wang", 1),
    "贾": (13, "金", "jia", 3),
    "韦": (9, "土", "wei", 2),
    "毛": (4, "水", "mao", 2),
    "郝": (14, "金", "hao", 3),
    "莫": (13, "木", "mo", 4),
    "欧阳": None,
}

SURNAMES = list("王李张刘陈杨黄赵吴周徐孙马朱胡郭何高林郑罗梁宋谢唐韩曹许邓萧冯曾程蔡彭潘袁于董余苏叶吕魏蒋田杜丁沈姜范江傅钟卢汪戴崔任陆廖姚方金邱夏谭韦贾邹石熊孟秦阎薛侯雷白龙段郝孔邵史毛常万顾赖武康贺严尹钱施牛洪龚")
COMPOUNDS = ["欧阳", "司马", "上官", "诸葛", "夏侯", "皇甫", "尉迟", "公孙", "慕容", "司徒", "端木", "东方", "独孤", "南宫", "闻人", "长孙", "宇文", "轩辕", "令狐", "钟离"]


def lookup(char: str):
    row = rows.get(char)
    if row and (row["康熙笔画"] or "").strip() and (row["五行"] or "").strip():
        py = (row["音"] or "").strip().split()[0] if row["音"] else ""
        tone = int(row["音调"]) if (row["音调"] or "").strip().isdigit() else 0
        return int(row["康熙笔画"]), row["五行"], py, tone
    manual = MANUAL.get(char)
    if manual:
        return manual
    return None


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"')


cites: dict[str, str] = {}
if CITE.exists():
    with CITE.open(encoding="utf-8") as handle:
        next(handle)
        for line in handle:
            if not line.strip():
                continue
            char, cite = line.rstrip("\n").split("\t", 1)
            cites[char] = cite


chars = []
missing = []
seen = set()
with TSV.open(encoding="utf-8") as handle:
    next(handle)
    for line in handle:
        if not line.strip():
            continue
        parts = line.rstrip("\n").split("\t")
        if len(parts) != 12:
            raise SystemExit(f"bad row: {parts}")
        c, py, tone, gender, struct, role, styles, sense, themes, glyphs, industries, freq = parts
        if len(c) != 1 or py == "skip":
            continue
        if c in seen:
            raise SystemExit(f"duplicate {c}")
        seen.add(c)
        found = lookup(c)
        if not found or not found[0] or not found[1]:
            missing.append(c)
            continue
        kx, wx, csv_py, csv_tone = found
        chars.append(
            {
                "c": c,
                "py": py or csv_py,
                "tone": int(tone or csv_tone or 1),
                "wx": wx,
                "kx": kx,
                "gender": gender,
                "struct": struct,
                "role": role,
                "styles": [s for s in styles.split(",") if s],
                "sense": sense,
                "themes": [s for s in themes.split(",") if s],
                "parts": [s for s in glyphs.split(",") if s],
                "industries": [s for s in industries.split(",") if s],
                "freq": int(freq),
                "cite": cites.get(c, ""),
            }
        )

if missing:
    print("MISSING", "".join(missing))
    raise SystemExit(1)

def arr(values):
    return "[" + ", ".join(f'"{esc(v)}"' for v in values) + "]"

lines = [
    'import type { Element } from "@/lib/elements"',
    "",
    "export type Glyph = {",
    "  c: string",
    "  py: string",
    "  tone: 1 | 2 | 3 | 4",
    "  wx: Element",
    "  kx: number",
    "  gender: \"m\" | \"f\" | \"n\" | \"b\"",
    "  struct: string",
    "  role: \"root\" | \"wing\" | \"both\"",
    "  styles: string[]",
    "  sense: string",
    "  themes: string[]",
    "  parts: string[]",
    "  industries: string[]",
    "  freq: 1 | 2 | 3",
    "  cite: string",
    "}",
    "",
    "export const GLYPHS: Glyph[] = [",
]
for item in chars:
    lines.append(
        "  {"
        + f' c: "{item["c"]}", py: "{item["py"]}", tone: {item["tone"]} as const, wx: "{item["wx"]}", kx: {item["kx"]},'
        + f' gender: "{item["gender"]}", struct: "{item["struct"]}", role: "{item["role"]}",'
        + f" styles: {arr(item['styles'])}, sense: \"{esc(item['sense'])}\","
        + f" themes: {arr(item['themes'])}, parts: {arr(item['parts'])},"
        + f" industries: {arr(item['industries'])}, freq: {item['freq']} as const, cite: \"{esc(item['cite'])}\""
        + " },"
    )
lines.append("]")
lines.append("")
lines.append("export const GLYPH_BY_CHAR = new Map(GLYPHS.map((item) => [item.c, item]))")
lines.append("")
(ROOT / "lib" / "lexicon.ts").write_text("\n".join(lines) + "\n", encoding="utf-8")

READINGS = {
    "王": ("wang", 2), "李": ("li", 3), "张": ("zhang", 1), "刘": ("liu", 2), "陈": ("chen", 2),
    "杨": ("yang", 2), "黄": ("huang", 2), "赵": ("zhao", 4), "吴": ("wu", 2), "周": ("zhou", 1),
    "徐": ("xu", 2), "孙": ("sun", 1), "马": ("ma", 3), "朱": ("zhu", 1), "胡": ("hu", 2),
    "郭": ("guo", 1), "何": ("he", 2), "高": ("gao", 1), "林": ("lin", 2), "郑": ("zheng", 4),
    "罗": ("luo", 2), "梁": ("liang", 2), "宋": ("song", 4), "谢": ("xie", 4), "唐": ("tang", 2),
    "韩": ("han", 2), "曹": ("cao", 2), "许": ("xu", 3), "邓": ("deng", 4), "萧": ("xiao", 1),
    "冯": ("feng", 2), "曾": ("zeng", 1), "程": ("cheng", 2), "蔡": ("cai", 4), "彭": ("peng", 2),
    "潘": ("pan", 1), "袁": ("yuan", 2), "于": ("yu", 2), "董": ("dong", 3), "余": ("yu", 2),
    "苏": ("su", 1), "叶": ("ye", 4), "吕": ("lv", 3), "魏": ("wei", 4), "蒋": ("jiang", 3),
    "田": ("tian", 2), "杜": ("du", 4), "丁": ("ding", 1), "沈": ("shen", 3), "姜": ("jiang", 1),
    "范": ("fan", 4), "江": ("jiang", 1), "傅": ("fu", 4), "钟": ("zhong", 1), "卢": ("lu", 2),
    "汪": ("wang", 1), "戴": ("dai", 4), "崔": ("cui", 1), "任": ("ren", 2), "陆": ("lu", 4),
    "廖": ("liao", 4), "姚": ("yao", 2), "方": ("fang", 1), "金": ("jin", 1), "邱": ("qiu", 1),
    "夏": ("xia", 4), "谭": ("tan", 2), "韦": ("wei", 2), "贾": ("jia", 3), "邹": ("zou", 1),
    "石": ("shi", 2), "熊": ("xiong", 2), "孟": ("meng", 4), "秦": ("qin", 2), "阎": ("yan", 2),
    "薛": ("xue", 1), "侯": ("hou", 2), "雷": ("lei", 2), "白": ("bai", 2), "龙": ("long", 2),
    "段": ("duan", 4), "郝": ("hao", 3), "孔": ("kong", 3), "邵": ("shao", 4), "史": ("shi", 3),
    "毛": ("mao", 2), "常": ("chang", 2), "万": ("wan", 4), "顾": ("gu", 4), "赖": ("lai", 4),
    "武": ("wu", 3), "康": ("kang", 1), "贺": ("he", 4), "严": ("yan", 2), "尹": ("yin", 3),
    "钱": ("qian", 2), "施": ("shi", 1), "牛": ("niu", 2), "洪": ("hong", 2), "龚": ("gong", 1),
    "欧": ("ou", 1), "阳": ("yang", 2), "司": ("si", 1), "上": ("shang", 4), "官": ("guan", 1),
    "诸": ("zhu", 1), "葛": ("ge", 3), "皇": ("huang", 2), "甫": ("fu", 3), "尉": ("wei", 4),
    "迟": ("chi", 2), "公": ("gong", 1), "慕": ("mu", 4), "容": ("rong", 2), "徒": ("tu", 2),
    "端": ("duan", 1), "木": ("mu", 4), "东": ("dong", 1), "独": ("du", 2), "孤": ("gu", 1),
    "南": ("nan", 2), "宫": ("gong", 1), "闻": ("wen", 2), "人": ("ren", 2), "长": ("zhang", 3),
    "宇": ("yu", 3), "文": ("wen", 2), "轩": ("xuan", 1), "辕": ("yuan", 2), "令": ("ling", 2),
    "狐": ("hu", 2), "离": ("li", 2),
}
STRIP = str.maketrans({
    "ā": "a", "á": "a", "ǎ": "a", "à": "a",
    "ē": "e", "é": "e", "ě": "e", "è": "e",
    "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
    "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
    "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
    "ǖ": "v", "ǘ": "v", "ǚ": "v", "ǜ": "v", "ü": "v",
})

def bare(py: str) -> str:
    return (py or "").strip().lower().translate(STRIP).replace("ü", "v")

surname_chars = []
for text in SURNAMES:
    surname_chars.append(text)
for text in COMPOUNDS:
    for ch in text:
        if ch not in surname_chars:
            surname_chars.append(ch)

surnames = []
missing_surnames = []
for ch in surname_chars:
    found = lookup(ch)
    if not found or not found[0] or not found[1]:
        missing_surnames.append(ch)
        continue
    kx, wx, py, tone = found
    py = bare(py)
    if ch in READINGS and (not py or tone == 0):
        py, tone = READINGS[ch]
    elif ch in READINGS and not py:
        py, tone = READINGS[ch]
    if not py and ch in READINGS:
        py, tone = READINGS[ch]
    surnames.append((ch, kx, wx, py, tone or 1))

if missing_surnames:
    print("MISSING SURNAMES", "".join(missing_surnames))
    raise SystemExit(1)

s_lines = [
    'import type { Element } from "@/lib/elements"',
    "",
    "export type SurnameGlyph = { kx: number; wx: Element; py: string; tone: number }",
    "",
    "export const SURNAME_GLYPH: Record<string, SurnameGlyph> = {",
]
for ch, kx, wx, py, tone in surnames:
    s_lines.append(f'  "{ch}": {{ kx: {kx}, wx: "{wx}", py: "{py}", tone: {tone} }},')
s_lines.append("}")
s_lines.append("")
s_lines.append("export const COMPOUND_SURNAMES = [")
for name in sorted(COMPOUNDS, key=len, reverse=True):
    s_lines.append(f'  "{name}",')
s_lines.append("]")
s_lines.append("")
(ROOT / "lib" / "surnames.ts").write_text("\n".join(s_lines) + "\n", encoding="utf-8")
print(f"glyphs {len(chars)} surnames {len(surnames)}")
