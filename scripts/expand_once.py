"""Append naming characters and classical citations, then stop.

Run once: python3 scripts/expand_once.py
Rows already present in chars.tsv are skipped. Citations are rewritten from this file.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHARS = ROOT / "scripts" / "chars.tsv"
CITES = ROOT / "scripts" / "citations.tsv"

# c, py, tone, gender, struct, role, styles, sense, themes, parts, industries, freq
NEW = """
涵	han	2	n	左右	both	清雅,书卷	水泽包容	包容,深广	氵,函	tea,edu	2
熙	xi	1	n	上下	both	明朗,书卷	光明而和乐	光明,和乐	火,臣	edu,media	2
乐	yue	4	n	独体	wing	明朗,古典	音乐与喜悦	音乐,和乐	乐	edu,media	1
学	xue	2	n	上下	root	书卷,明朗	学习	学养,开始	子,爻	edu	1
渊	yuan	1	m	左右	wing	书卷,大气	深水	深广,潜藏	氵,渊	edu,finance	2
岩	yan	2	m	上下	root	古典,大气	山石高峻	山石,坚定	山,石	estate,tea	2
磊	lei	3	m	上下	wing	大气,明朗	众石垒起，取磊落	磊落,坚实	石	estate,jewel	2
岳	yue	4	m	上下	wing	大气,古典	高山	山岳,高远	山,丘	estate,agri	2
霜	shuang	1	n	上下	wing	清雅,古典	秋后结成的白	清白,秋意	雨,相	tea,agri	2
露	lu	4	f	上下	wing	清雅,温润	凝成的水珠	清晨,恩泽	雨,路	tea,agri	2
霞	xia	2	f	上下	wing	清雅,灵动	日边的彩云	晚霞,光彩	雨,段	fashion,media	2
虹	hong	2	n	左右	wing	灵动,明朗	雨后天上的桥	虹霓,连接	虫,工	media,fashion	3
霓	ni	2	f	上下	wing	清雅,灵动	虹的外圈	虹霓,衣裳	雨,霓	fashion,media	3
彤	tong	2	f	左右	wing	明朗,古典	赤色	赤色,光明	丹,彡	fashion,jewel	2
丹	dan	1	n	独体	wing	明朗,古典	赤心，也是丹砂	赤诚,颜色	丹	health,jewel	2
碧	bi	4	f	上下	wing	清雅,明朗	青绿色的玉	玉色,澄明	王,白	jewel,tea	2
苍	cang	1	n	上下	wing	大气,清雅	青苍的草色	苍茫,草木	艹,仓	agri,tea	2
竹	zhu	2	n	独体	both	清雅,书卷	直而有节	气节,清雅	竹	tea,edu	1
梅	mei	2	f	左右	wing	清雅,古典	冬末开花	风骨,早春	木,每	tea,fashion	1
菊	ju	2	f	上下	wing	清雅,古典	秋天的花	隐逸,秋日	艹,菊	tea,agri	2
桃	tao	2	f	左右	wing	温润,明朗	春天的花和果	春日,美盛	木,兆	food,fashion	2
杏	xing	4	n	上下	wing	温润,书卷	春花，也是讲学的地方	春日,学养	木,口	edu,food	2
棠	tang	2	n	上下	wing	古典,温润	甘棠，后人在树下怀念	荫庇,怀念	木,尚	estate,edu	3
柳	liu	3	f	左右	wing	清雅,灵动	柔软的枝条	送别,春风	木,卯	fashion,tea	2
桂	gui	4	f	左右	wing	清雅,古典	秋天还香的树	秋日,芬芳	木,圭	tea,fashion	2
葵	kui	2	f	上下	wing	明朗,温润	向着太阳的花	向阳,忠忱	艹,癸	agri,fashion	3
芳	fang	1	f	上下	wing	清雅,温润	花草的香	芬芳,美名	艹,方	tea,fashion	1
芬	fen	1	f	上下	wing	清雅,温润	香气散开	香气,清新	艹,分	tea,fashion	2
菲	fei	1	f	上下	wing	清雅,灵动	花草茂盛	茂盛,微光	艹,非	fashion,agri	2
菁	jing	1	n	上下	wing	清雅,书卷	草木长得很盛	茂盛,精华	艹,青	tea,edu	2
英	ying	1	n	上下	wing	明朗,书卷	花，也指杰出的人	花英,才具	艹,央	edu,media	1
昌	chang	1	m	上下	wing	明朗,大气	光明而兴盛	兴盛,光明	日,曰	media,finance	2
晟	sheng	4	m	上下	wing	明朗,大气	日光盛大	光明,兴盛	日,成	energy,media	3
烨	ye	4	m	左右	wing	明朗,大气	火光盛大	光明,照耀	火,华	energy,media	3
炜	wei	3	m	左右	wing	明朗,古典	光彩鲜明	光彩,赤色	火,韦	jewel,fashion	3
焕	huan	4	n	左右	wing	明朗,书卷	光彩一新	光彩,文采	火,奂	edu,media	2
灿	can	4	n	左右	wing	明朗,灵动	光明灿烂	灿烂,可见	火,山	energy,media	2
曦	xi	1	n	左右	wing	明朗,大气	清晨的阳光	晨光,开端	日,羲	energy,edu	3
昂	ang	2	m	上下	wing	大气,明朗	把头抬起来	气度,高扬	日,卬	edu,media	2
昆	kun	1	m	上下	wing	古典,温润	兄长，也指后裔	同气,绵延	日,比	edu,baby	2
昶	chang	3	m	左右	wing	明朗,温润	白天很长	长久,光明	日,永	estate,edu	3
昀	yun	2	m	左右	wing	明朗,清雅	日光	日光,温和	日,匀	edu,media	3
晗	han	2	n	左右	wing	明朗,温润	天快亮了	黎明,希望	日,含	baby,edu	2
端	duan	1	n	左右	root	古典,书卷	端正	端正,开始	立,耑	law,edu	2
肃	su	4	n	上下	root	古典,书卷	恭敬而严整	恭敬,严整	聿,肃	law,edu	2
慎	shen	4	n	左右	root	书卷,古典	做事小心，说话不苟	谨慎,言语	忄,真	law,edu	2
谨	jin	3	n	左右	root	书卷,古典	说话有分寸	谨慎,信用	讠,堇	law,edu	2
忠	zhong	1	n	上下	root	古典,温润	为别人把心用尽	忠信,担当	中,心	law,edu	2
勇	yong	3	m	上下	wing	大气,明朗	敢做该做的事	勇气,担当	力,甬	energy,edu	2
毅	yi	4	m	左右	root	大气,古典	认定了就不改	坚定,担当	殳,豙	edu,energy	2
健	jian	4	n	左右	wing	明朗,大气	运行不息	强健,不息	亻,建	health,energy	1
坚	jian	1	n	上下	root	古典,大气	磨了也不变薄	坚定,耐久	土,臤	estate,energy	2
卓	zhuo	4	m	上下	wing	大气,书卷	高出同辈	超拔,独立	卜,早	edu,tech	2
越	yue	4	n	左右	wing	大气,明朗	跨过一段路	超越,远行	走,戉	edu,tech	2
超	chao	1	n	左右	wing	大气,明朗	跃到更高的地方	超越,高举	走,召	tech,edu	2
迈	mai	4	n	左右	wing	大气,明朗	把步子迈出去	前行,时光	辶,万	tech,edu	2
悟	wu	4	n	左右	root	书卷,清雅	心里忽然明白	领悟,内省	忄,吾	edu,ai	2
觉	jue	2	n	上下	wing	书卷,明朗	让人明白过来	觉醒,启蒙	见,学	edu,ai	2
察	cha	2	n	上下	root	书卷,明朗	看清楚再下判断	洞察,判断	宀,祭	ai,law	2
观	guan	1	n	左右	wing	书卷,明朗	抬头看，也低头看	观察,洞见	见,雚	ai,media	2
闻	wen	2	n	左右	wing	书卷,古典	听见，也指名声	听闻,求道	门,耳	edu,media	2
习	xi	2	n	独体	root	书卷,明朗	一遍遍去做	学习,实践	习	edu	1
往	wang	3	n	左右	wing	书卷,大气	走到要去的地方	前行,志向	彳,主	edu,tech	2
协	xie	2	n	左右	both	温润,明朗	合到一处	和合,协作	十,办	tech,edu	2
睦	mu	4	n	左右	root	温润,古典	彼此亲近	和睦,亲族	目,坴	baby,edu	2
谐	xie	2	n	左右	both	温润,书卷	声音配在一起	和谐,音乐	讠,皆	media,edu	2
定	ding	4	n	上下	root	古典,温润	心知道停在哪里	安定,判断	宀,正	law,estate	1
寿	shou	4	n	上下	wing	古典,温润	年岁长久	长寿,祝福	寿	health,baby	2
福	fu	2	n	左右	wing	温润,古典	事情顺遂	福泽,家业	礻,畐	baby,estate	1
禄	lu	4	n	左右	wing	古典,大气	俸禄，也是福分	福禄,生计	礻,录	finance,edu	2
禧	xi	3	n	左右	wing	温润,古典	值得庆贺的喜	喜庆,祝福	礻,喜	baby,food	2
祺	qi	2	n	左右	wing	古典,温润	吉祥	吉祥,安宁	礻,其	baby,edu	2
庆	qing	4	n	左右	wing	明朗,温润	值得庆贺的事	喜庆,积善	广,大	baby,media	2
喜	xi	3	n	上下	wing	明朗,温润	心里高兴	喜悦,相见	喜	baby,food	1
愉	yu	2	n	左右	wing	温润,明朗	和悦	和悦,心情	忄,俞	health,baby	2
颜	yan	2	n	左右	wing	书卷,清雅	容色	容色,如花	页,彦	fashion,media	2
仪	yi	2	n	左右	wing	古典,书卷	容止有度	仪容,法度	亻,义	law,edu	2
娴	xian	2	f	左右	wing	清雅,古典	文静	文静,从容	女,闲	edu,fashion	2
媛	yuan	2	f	左右	wing	古典,清雅	美好的女子	美善,仪容	女,爰	fashion,edu	2
嫣	yan	1	f	左右	wing	清雅,灵动	笑容柔和	笑容,美	女,焉	fashion,media	3
玲	ling	2	f	左右	wing	清雅,灵动	玉相击的声音	玉声,清脆	王,令	jewel,fashion	2
珍	zhen	1	f	左右	wing	清雅,古典	值得看重	珍重,宝贝	王,㐱	jewel,baby	2
珠	zhu	1	f	左右	wing	清雅,明朗	圆润的宝物	珠宝,圆满	王,朱	jewel,fashion	2
琼	qiong	2	f	左右	wing	清雅,古典	美玉	美玉,回报	王,京	jewel,tea	2
莹	ying	2	f	上下	wing	清雅,明朗	玉的光洁	光洁,玉色	玉,荧	jewel,fashion	2
冰	bing	1	n	独体	wing	清雅,明朗	凝住的水	清白,严冬	冫,水	tea,health	2
洁	jie	2	n	左右	root	清雅,书卷	干净	清洁,自持	氵,吉	health,tea	2
涟	lian	2	f	左右	wing	清雅,灵动	水面细细的波纹	水波,清流	氵,连	tea,media	3
漪	yi	1	f	左右	wing	清雅,灵动	轻轻的水纹	水纹,轻柔	氵,奇	tea,fashion	3
波	bo	1	n	左右	wing	灵动,大气	起伏的水	水波,远行	氵,皮	media,tea	2
浦	pu	3	n	左右	wing	清雅,古典	水边	水岸,送别	氵,甫	estate,tea	3
涧	jian	4	n	左右	wing	清雅,古典	山间流水	山涧,隐居	氵,间	tea,estate	3
潭	tan	2	n	左右	wing	清雅,书卷	很深的水	深潭,静定	氵,覃	tea,edu	2
沧	cang	1	n	左右	wing	大气,清雅	水色青苍	沧浪,洗心	氵,仓	tea,media	2
湘	xiang	1	f	左右	wing	清雅,古典	水名，也指楚地	湘水,楚辞	氵,相	tea,media	2
淇	qi	2	n	左右	wing	清雅,书卷	水名	淇水,绿竹	氵,其	edu,tea	2
洛	luo	4	n	左右	wing	书卷,古典	水名	洛书,送别	氵,各	edu,media	2
渭	wei	4	n	左右	wing	古典,温润	水名	渭阳,送别	氵,胃	edu,estate	3
汉	han	4	n	左右	wing	大气,书卷	水名	汉水,广远	氵,又	media,edu	2
江	jiang	1	n	左右	wing	大气,清雅	大水	江水,长远	氵,工	tea,media	1
河	he	2	n	左右	wing	大气,古典	大水	河水,洋洋	氵,可	estate,agri	1
""".strip().splitlines()

CITE = {
    "清": "《楚辞·渔父》：沧浪之水清兮，可以濯吾缨",
    "和": "《论语·学而》：礼之用，和为贵",
    "安": "《诗经·小雅·常棣》：丧乱既平，既安且宁",
    "宁": "《易·乾·文言》：万国咸宁",
    "明": "《礼记·大学》：大学之道，在明明德",
    "远": "《论语·泰伯》：士不可以不弘毅，任重而道远",
    "文": "《论语·雍也》：文质彬彬，然后君子",
    "思": "《论语·为政》：学而不思则罔",
    "知": "《论语·为政》：知之为知之，不知为不知",
    "行": "《论语·公冶长》：听其言而观其行",
    "信": "《论语·为政》：人而无信，不知其可也",
    "德": "《论语·里仁》：德不孤，必有邻",
    "仁": "《论语·颜渊》：樊迟问仁，子曰爱人",
    "义": "《论语·里仁》：君子喻于义",
    "礼": "《论语·学而》：礼之用，和为贵",
    "正": "《论语·子路》：其身正，不令而行",
    "修": "《礼记·大学》：自天子以至于庶人，壹是皆以修身为本",
    "齐": "《礼记·大学》：欲治其国者，先齐其家",
    "志": "《论语·为政》：吾十有五而志于学",
    "贤": "《论语·里仁》：见贤思齐焉",
    "华": "《诗经·周南·桃夭》：桃之夭夭，灼灼其华",
    "博": "《礼记·中庸》：博学之，审问之",
    "辰": "《尚书·尧典》：历象日月星辰",
    "泽": "《孟子·滕文公上》：若夫润泽之",
    "海": "《老子》：江海所以能为百谷王者，以其善下之",
    "川": "《论语·子罕》：子在川上曰，逝者如斯夫",
    "月": "《诗经·陈风·月出》：月出皎兮",
    "星": "《诗经·小雅·小星》：嘒彼小星",
    "雪": "《世说新语·言语》：未若柳絮因风起",
    "秋": "《楚辞·九歌·湘夫人》：袅袅兮秋风",
    "春": "《诗经·豳风·七月》：春日载阳",
    "诗": "《尚书·舜典》：诗言志",
    "琴": "《礼记·乐记》：君子听琴瑟之声，则思志义之臣",
    "玉": "《诗经·秦风·小戎》：言念君子，温其如玉",
    "兰": "《易·系辞上》：同心之言，其臭如兰",
    "荷": "《诗经·陈风·泽陂》：有蒲与荷",
    "莲": "《乐府诗集·江南》：江南可采莲",
    "松": "《论语·子罕》：岁寒，然后知松柏之后凋也",
    "柏": "《论语·子罕》：岁寒，然后知松柏之后凋也",
    "鹤": "《诗经·小雅·鹤鸣》：鹤鸣于九皋，声闻于天",
    "鸿": "《诗经·小雅·鸿雁》：鸿雁于飞",
    "道": "《论语·里仁》：朝闻道，夕死可矣",
    "平": "《礼记·大学》：国治而后天下平",
    "良": "《论语·学而》：夫子温良恭俭让以得之",
    "诺": "《史记·季布栾布列传》：得黄金百斤，不如得季布一诺",
    "芷": "《楚辞·离骚》：扈江离与辟芷兮",
    "萱": "《诗经·卫风·伯兮》：焉得谖草，言树之背",
    "熙": "《诗经·大雅·文王》：穆穆文王，於缉熙敬止",
    "乐": "《论语·泰伯》：兴于诗，立于礼，成于乐",
    "学": "《论语·学而》：学而时习之，不亦说乎",
    "渊": "《诗经·小雅·鹤鸣》：鱼潜在渊",
    "岩": "《诗经·鲁颂·閟宫》：泰山岩岩",
    "岳": "《诗经·大雅·崧高》：崧高维岳，骏极于天",
    "霜": "《诗经·秦风·蒹葭》：白露为霜",
    "露": "《诗经·秦风·蒹葭》：蒹葭苍苍，白露为霜",
    "虹": "《礼记·月令》：虹始见",
    "霓": "《楚辞·九歌·东君》：青云衣兮白霓裳",
    "彤": "《诗经·邶风·静女》：贻我彤管",
    "丹": "《诗经·秦风·终南》：颜如渥丹",
    "苍": "《诗经·秦风·蒹葭》：蒹葭苍苍",
    "竹": "《诗经·卫风·淇奥》：瞻彼淇奥，绿竹猗猗",
    "梅": "《诗经·召南·摽有梅》：摽有梅，其实七兮",
    "菊": "陶渊明《饮酒》：采菊东篱下",
    "桃": "《诗经·周南·桃夭》：桃之夭夭，灼灼其华",
    "杏": "《庄子·渔父》：休坐乎杏坛之上",
    "棠": "《诗经·召南·甘棠》：蔽芾甘棠，勿翦勿伐",
    "柳": "《诗经·小雅·采薇》：昔我往矣，杨柳依依",
    "桂": "《楚辞·远游》：丽桂树之冬荣",
    "芳": "《楚辞·离骚》：芳与泽其杂糅兮",
    "芬": "《诗经·大雅·凫鹥》：燔炙芬芬",
    "菲": "《诗经·邶风·谷风》：采葑采菲",
    "菁": "《诗经·唐风·杕杜》：其叶菁菁",
    "英": "《诗经·郑风·有女同车》：颜如舜英",
    "昌": "《尚书·仲虺之诰》：推亡固存，邦乃其昌",
    "炜": "《诗经·邶风·静女》：彤管有炜",
    "焕": "《论语·泰伯》：焕乎其有文章",
    "昂": "《楚辞·远游》：服偃蹇以低昂兮",
    "昆": "《诗经·王风·葛藟》：谓他人昆",
    "端": "《孟子·离娄下》：夫尹公之他，端人也",
    "肃": "《诗经·大雅·思齐》：肃肃在庙",
    "慎": "《论语·学而》：敏于事而慎于言",
    "谨": "《论语·学而》：谨而信",
    "忠": "《论语·学而》：为人谋而不忠乎",
    "勇": "《论语·宪问》：仁者必有勇",
    "毅": "《论语·泰伯》：士不可以不弘毅",
    "健": "《易·乾·象》：天行健，君子以自强不息",
    "坚": "《论语·阳货》：不曰坚乎，磨而不磷",
    "卓": "《论语·子罕》：如有所立卓尔",
    "超": "《楚辞·卜居》：宁超然高举以保真乎",
    "迈": "《诗经·唐风·蟋蟀》：今我不乐，日月其迈",
    "觉": "《孟子·万章上》：予将以斯道觉斯民",
    "察": "《论语·为政》：视其所以，观其所由，察其所安",
    "观": "《易·系辞上》：仰则观象于天",
    "闻": "《论语·里仁》：朝闻道，夕死可矣",
    "习": "《论语·学而》：学而时习之",
    "往": "《论语·微子》：往者不可谏，来者犹可追",
    "协": "《尚书·尧典》：协和万邦",
    "睦": "《尚书·尧典》：九族既睦",
    "谐": "《尚书·舜典》：八音克谐",
    "定": "《礼记·大学》：知止而后有定",
    "寿": "《诗经·小雅·天保》：如南山之寿",
    "福": "《尚书·洪范》：五福",
    "禄": "《诗经·小雅·天保》：受天百禄",
    "祺": "《诗经·大雅·行苇》：寿考维祺",
    "庆": "《易·坤·文言》：积善之家，必有余庆",
    "喜": "《诗经·郑风·风雨》：既见君子，云胡不喜",
    "颜": "《诗经·郑风·有女同车》：颜如舜华",
    "仪": "《诗经·大雅·烝民》：令仪令色",
    "媛": "《诗经·鄘风·君子偕老》：邦之媛也",
    "嫣": "宋玉《登徒子好色赋》：嫣然一笑",
    "琼": "《诗经·卫风·木瓜》：投我以木瓜，报之以琼琚",
    "冰": "《诗经·豳风·七月》：二之日凿冰冲冲",
    "洁": "《论语·述而》：人洁己以进",
    "涟": "《诗经·魏风·伐檀》：河水清且涟猗",
    "波": "《楚辞·九歌·湘夫人》：洞庭波兮木叶下",
    "浦": "《楚辞·九歌·河伯》：送美人兮南浦",
    "涧": "《诗经·卫风·考槃》：考槃在涧",
    "沧": "《楚辞·渔父》：沧浪之水清兮",
    "湘": "《楚辞·九歌·湘君》",
    "淇": "《诗经·卫风·淇奥》：瞻彼淇奥，绿竹猗猗",
    "洛": "《易·系辞上》：河出图，洛出书",
    "渭": "《诗经·秦风·渭阳》：我送舅氏，曰至渭阳",
    "汉": "《诗经·周南·汉广》：汉之广矣，不可泳思",
    "江": "《诗经·周南·汉广》：江之永矣",
    "河": "《诗经·卫风·硕人》：河水洋洋",
}

existing = set()
for line in CHARS.read_text(encoding="utf-8").splitlines()[1:]:
    if line.strip():
        existing.add(line.split("\t")[0])

added = []
for line in NEW:
    char = line.split("\t")[0]
    if char in existing:
        continue
    if len(line.split("\t")) != 12:
        raise SystemExit(f"bad addition: {line}")
    added.append(line)
    existing.add(char)

with CHARS.open("a", encoding="utf-8") as handle:
    if added:
        handle.write("\n" + "\n".join(added) + "\n")

lines = ["c\tcite"]
for char, cite in CITE.items():
    if "\t" in cite:
        raise SystemExit(char)
    lines.append(f"{char}\t{cite}")
CITES.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"added {len(added)} citations {len(CITE)}")
