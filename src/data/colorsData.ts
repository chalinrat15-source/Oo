import { BraceColor, CuratedPalette, ColorScore } from '../types';

export const BRACE_COLORS: BraceColor[] = [
  // Pastels & Sweets
  {
    id: 'baby-pink',
    nameTh: 'ชมพูพาสเทล',
    nameEn: 'Baby Pink',
    hex: '#FFB7D5',
    category: 'pastel',
    description: 'ชมพูนมละมุน ยอดฮิตตลอดกาล ให้ลุคหวานน่ารักฟรุ้งฟริ้ง',
    styleTags: ['cute', 'sweet', 'minimal'],
    moodTags: ['sweet', 'cute', 'cheerful'],
    popularRank: 1,
  },
  {
    id: 'bubblegum-pink',
    nameTh: 'ชมพูบับเบิ้ลกัม',
    nameEn: 'Bubblegum Pink',
    hex: '#FF69B4',
    category: 'vibrant',
    description: 'ชมพูสดใส ชวนให้นึกถึงลูกอม มีเสน่ห์สดใสสุดๆ',
    styleTags: ['cute', 'bright'],
    moodTags: ['cheerful', 'cute'],
    popularRank: 2,
  },
  {
    id: 'lavender',
    nameTh: 'ม่วงลาเวนเดอร์',
    nameEn: 'Lavender Bliss',
    hex: '#C8A2C8',
    category: 'pastel',
    description: 'ม่วงอ่อนนุ่มนวล ชวนฝัน ช่วยขับรอยยิ้มให้อ่อนหวาน',
    styleTags: ['sweet', 'minimal', 'cute'],
    moodTags: ['sweet', 'calm', 'mysterious'],
    popularRank: 3,
  },
  {
    id: 'sky-blue',
    nameTh: 'ฟ้าพาสเทล',
    nameEn: 'Sky Blue',
    hex: '#87CEEB',
    category: 'pastel',
    description: 'ฟ้าสดใสเหมือนท้องฟ้าฤดูร้อน ฟันดูขาวสะอาดตา',
    styleTags: ['cute', 'minimal', 'bright'],
    moodTags: ['cheerful', 'calm', 'cute'],
    popularRank: 4,
  },
  {
    id: 'mint-green',
    nameTh: 'เขียวมิ้นต์',
    nameEn: 'Fresh Mint',
    hex: '#98FF98',
    category: 'pastel',
    description: 'เขียวสดชื่น สบายตา ยอดฮิตสายมินิมอลและธรรมชาติ',
    styleTags: ['minimal', 'cute', 'sweet'],
    moodTags: ['calm', 'cheerful', 'sweet'],
    popularRank: 5,
  },
  {
    id: 'lilac-dream',
    nameTh: 'ม่วงไลแลค',
    nameEn: 'Lilac Dream',
    hex: '#B39DDB',
    category: 'pastel',
    description: 'ม่วงอมฟ้าพาสเทลยอดฮิต ละมุนตา ไม่ฉูดฉาดเกินไป',
    styleTags: ['sweet', 'minimal'],
    moodTags: ['sweet', 'calm'],
    popularRank: 6,
  },
  {
    id: 'baby-blue',
    nameTh: 'เบบี้บลู',
    nameEn: 'Baby Blue',
    hex: '#A0D2EB',
    category: 'pastel',
    description: 'ฟ้าอ่อนละมุนตา เข้ากับเสื้อผ้าได้แทบทุกสไตล์',
    styleTags: ['sweet', 'minimal'],
    moodTags: ['calm', 'sweet'],
    popularRank: 7,
  },
  {
    id: 'peach-coral',
    nameTh: 'พีชปะการัง',
    nameEn: 'Peach Coral',
    hex: '#FFAB91',
    category: 'pastel',
    description: 'ส้มพีชอบอุ่น หน้าสว่าง สดใสแบบเป็นธรรมชาติ',
    styleTags: ['sweet', 'bright'],
    moodTags: ['cheerful', 'sweet'],
    popularRank: 8,
  },
  {
    id: 'butter-yellow',
    nameTh: 'เหลืองเนยพาสเทล',
    nameEn: 'Butter Yellow',
    hex: '#FFF59D',
    category: 'pastel',
    description: 'เหลืองละมุนสดใส ขี้เล่น ไม่เข้มจนฟันดูเหลือง',
    styleTags: ['cute', 'bright', 'minimal'],
    moodTags: ['cheerful', 'cute'],
    popularRank: 9,
  },

  // Vibrant & Pop
  {
    id: 'ocean-turquoise',
    nameTh: 'ฟ้าเทอร์ควอยซ์',
    nameEn: 'Ocean Turquoise',
    hex: '#26C6DA',
    category: 'vibrant',
    description: 'ฟ้าอมเขียวน้ำทะเล สดใส เปล่งประกายเมื่อยิ้มกว้าง',
    styleTags: ['bright', 'cool'],
    moodTags: ['cheerful', 'cool'],
    popularRank: 10,
  },
  {
    id: 'royal-purple',
    nameTh: 'ม่วงรอยัล',
    nameEn: 'Royal Purple',
    hex: '#7E57C2',
    category: 'vibrant',
    description: 'ม่วงสดลึก มีเสน่ห์ลึกลับ ชวนมอง ขับฟันขาว',
    styleTags: ['cool', 'bright'],
    moodTags: ['mysterious', 'cool'],
    popularRank: 11,
  },
  {
    id: 'neon-coral',
    nameTh: 'ส้มคอรัลสดใส',
    nameEn: 'Vibrant Coral',
    hex: '#FF7043',
    category: 'vibrant',
    description: 'ส้มอมชมพูเปี่ยมพลัง เหมาะกับช่วงซัมเมอร์หรือวันเกิด',
    styleTags: ['bright', 'cute'],
    moodTags: ['cheerful'],
    popularRank: 12,
  },
  {
    id: 'lemon-yellow',
    nameTh: 'เหลืองเลมอน',
    nameEn: 'Lemon Drop',
    hex: '#FFEB3B',
    category: 'vibrant',
    description: 'เหลืองสดใส ชวนยิ้ม เพิ่มพลังบวกให้ทุกวัน',
    styleTags: ['bright', 'cute'],
    moodTags: ['cheerful'],
    popularRank: 13,
  },
  {
    id: 'lime-green',
    nameTh: 'เขียวมะนาว',
    nameEn: 'Lime Pop',
    hex: '#76FF03',
    category: 'neon',
    description: 'เขียวมะนาวสะท้อนแสง สายแฟชั่นซ่าส์ โดดเด่นสุดซอย',
    styleTags: ['bright', 'cool'],
    moodTags: ['cheerful', 'cool'],
    popularRank: 14,
  },
  {
    id: 'cherry-red',
    nameTh: 'แดงเชอร์รี่',
    nameEn: 'Cherry Red',
    hex: '#E53935',
    category: 'vibrant',
    description: 'แดงสดสะดุดตา มั่นใจ ปังทุกเทศกาลและคริสต์มาส',
    styleTags: ['bright', 'cool'],
    moodTags: ['cheerful', 'cool'],
    popularRank: 15,
  },
  {
    id: 'hot-magenta',
    nameTh: 'มาเจนต้าป๊อป',
    nameEn: 'Hot Magenta',
    hex: '#D81B60',
    category: 'vibrant',
    description: 'ชมพูเข้มอมแดง สดแซ่บ สไตล์วัยรุ่น Y2K',
    styleTags: ['bright', 'cute'],
    moodTags: ['cheerful', 'cute'],
    popularRank: 16,
  },

  // Cool, Dark & Gothic
  {
    id: 'midnight-navy',
    nameTh: 'น้ำเงินมิดไนท์',
    nameEn: 'Midnight Navy',
    hex: '#1E3A8A',
    category: 'dark',
    description: 'น้ำเงินเข้มคลาสสิก ขับฟันขาวสะท้อนแสง ไม่ติดคราบอาหาร',
    styleTags: ['cool', 'dark', 'minimal'],
    moodTags: ['cool', 'mysterious', 'calm'],
    popularRank: 17,
  },
  {
    id: 'deep-emerald',
    nameTh: 'เขียวมรกตเข้ม',
    nameEn: 'Emerald Green',
    hex: '#00796B',
    category: 'dark',
    description: 'เขียวหรูหรา ลุ่มลึก เหมาะกับคนชอบความเท่แบบมีระดับ',
    styleTags: ['cool', 'dark'],
    moodTags: ['mysterious', 'cool'],
    popularRank: 18,
  },
  {
    id: 'deep-burgundy',
    nameTh: 'แดงเบอร์กันดี',
    nameEn: 'Deep Burgundy',
    hex: '#880E4F',
    category: 'dark',
    description: 'แดงไวน์เข้ม ดูแพง มีเสน่ห์แบบผู้ใหญ่ ฟันขาวเด่น',
    styleTags: ['cool', 'dark'],
    moodTags: ['mysterious', 'cool'],
    popularRank: 19,
  },
  {
    id: 'deep-plum',
    nameTh: 'ม่วงพลัมเข้ม',
    nameEn: 'Midnight Plum',
    hex: '#4A148C',
    category: 'dark',
    description: 'ม่วงเข้มเกือบดำ ลึกลับ น่าค้นหา สไตล์โกธิคชิค',
    styleTags: ['cool', 'dark'],
    moodTags: ['mysterious', 'cool'],
    popularRank: 20,
  },
  {
    id: 'pitch-black',
    nameTh: 'ดำสนิท',
    nameEn: 'Jet Black',
    hex: '#1F2937',
    category: 'dark',
    description: 'ดำเข้มสุดเท่ ขวัญใจสายสตรีท รอยยิ้มคมชัด',
    styleTags: ['cool', 'dark', 'minimal'],
    moodTags: ['cool', 'mysterious'],
    popularRank: 21,
  },
  {
    id: 'charcoal-grey',
    nameTh: 'เทาชาร์โคล',
    nameEn: 'Charcoal Grey',
    hex: '#4B5563',
    category: 'dark',
    description: 'เทาเข้มสุขุม ดูแลรักษาง่าย กลมกลืนกับแบร็กเก็ตโลหะ',
    styleTags: ['minimal', 'cool'],
    moodTags: ['calm', 'cool'],
    popularRank: 22,
  },

  // Minimal & Neutrals
  {
    id: 'pearl-silver',
    nameTh: 'เงินเมทัลลิก',
    nameEn: 'Silver Grey',
    hex: '#9CA3AF',
    category: 'metallic',
    description: 'กลืนไปกับเหล็กจัดฟัน ดูเนียน มินิมอล ไม่สะดุดตา',
    styleTags: ['minimal', 'cool'],
    moodTags: ['calm', 'cool'],
    popularRank: 23,
  },
  {
    id: 'crystal-white',
    nameTh: 'ขาวมุก',
    nameEn: 'Pearl White',
    hex: '#F3F4F6',
    category: 'neutral',
    description: 'ขาวมุกสะอาดตา เหมาะจับคู่ตัดกับสีเข้มหรือสีสดใส',
    styleTags: ['minimal', 'sweet'],
    moodTags: ['calm', 'sweet'],
    popularRank: 24,
  },
  {
    id: 'clear-ice',
    nameTh: 'ใสไอซ์บลู',
    nameEn: 'Ice Blue',
    hex: '#E0F2FE',
    category: 'pastel',
    description: 'ฟ้าอ่อนโปร่งแสง ดูใสสะอาด สะท้อนแสงวิบวับ',
    styleTags: ['minimal', 'sweet'],
    moodTags: ['calm', 'sweet'],
    popularRank: 25,
  },
  {
    id: 'warm-beige',
    nameTh: 'ครีมเบจ',
    nameEn: 'Warm Cream',
    hex: '#FDE68A',
    category: 'neutral',
    description: 'นุ่มนวล มินิมอล วอร์มโทน ดูเป็นมิตรและอบอุ่น',
    styleTags: ['minimal', 'sweet'],
    moodTags: ['calm', 'sweet'],
    popularRank: 26,
  },

  // Special Trendy Shades
  {
    id: 'sage-green',
    nameTh: 'เขียวเซจ',
    nameEn: 'Sage Green',
    hex: '#A3B18A',
    category: 'pastel',
    description: 'เขียวเอิร์ธโทนสุดมินิมอล เทรนด์ฮิตคาเฟ่ สไตล์ญี่ปุ่น',
    styleTags: ['minimal', 'cool'],
    moodTags: ['calm'],
    popularRank: 27,
  },
  {
    id: 'rose-gold',
    nameTh: 'โรสโกลด์',
    nameEn: 'Rose Gold',
    hex: '#E0A96D',
    category: 'metallic',
    description: 'ชมพูอมทองเปล่งประกาย สวยหรู ดูแพง',
    styleTags: ['sweet', 'cool'],
    moodTags: ['sweet', 'mysterious'],
    popularRank: 28,
  },
  {
    id: 'electric-blue',
    nameTh: 'น้ำเงินไฟฟ้านีออน',
    nameEn: 'Electric Blue',
    hex: '#0284C7',
    category: 'vibrant',
    description: 'น้ำเงินสว่างสด คมชัด โดดเด่นในระยะไกล',
    styleTags: ['bright', 'cool'],
    moodTags: ['cool', 'cheerful'],
    popularRank: 29,
  },
  {
    id: 'candy-grape',
    nameTh: 'องุ่นลูกกวาด',
    nameEn: 'Candy Grape',
    hex: '#9C27B0',
    category: 'vibrant',
    description: 'ม่วงสดใสรสผลไม้ น่ารัก ขี้เล่น สนุกสนาน',
    styleTags: ['cute', 'bright'],
    moodTags: ['cheerful', 'cute'],
    popularRank: 30,
  }
];

export const STYLE_OPTIONS = [
  { id: 'all', label: 'ทั้งหมด', emoji: '✨', desc: 'ทุกสไตล์ไม่จำกัด' },
  { id: 'cute', label: 'น่ารัก', emoji: '🧸', desc: 'สีสดใส โทนหวาน ละมุนใจ' },
  { id: 'sweet', label: 'หวาน', emoji: '🌸', desc: 'พาสเทล นุ่มนวล ชวนฝัน' },
  { id: 'cool', label: 'เท่', emoji: '😎', desc: 'คมเข้ม ทันสมัย มีสไตล์' },
  { id: 'bright', label: 'สดใส', emoji: '⚡', desc: 'นีออน คัลเลอร์ฟูล เปล่งประกาย' },
  { id: 'minimal', label: 'มินิมอล', emoji: '☁️', desc: 'เรียบง่าย สะอาดตา ดูสุภาพ' },
  { id: 'dark', label: 'สีเข้ม', emoji: '🖤', desc: 'ขับฟันขาว ไม่ติดคราบแกง' },
];

export const MOOD_OPTIONS = [
  { id: 'cheerful', label: 'สดใส', emoji: '😊', desc: 'มีพลัง ยิ้มรับวันใหม่' },
  { id: 'sweet', label: 'หวาน', emoji: '🌸', desc: 'โรแมนติก นุ่มนวล อบอุ่น' },
  { id: 'cool', label: 'เท่', emoji: '😎', desc: 'มั่นใจ คูลๆ คมชัด' },
  { id: 'mysterious', label: 'ลึกลับ', emoji: '💜', desc: 'น่าค้นหา มีเสน่ห์เฉพาะตัว' },
  { id: 'cute', label: 'น่ารัก', emoji: '🧸', desc: 'น่าเอ็นดู ขี้เล่น ขวัญใจเพื่อน' },
  { id: 'calm', label: 'สบายตา', emoji: '☁️', desc: 'ผ่อนคลาย สะอาดตา มินิมอล' },
];

export const OCCASION_OPTIONS = [
  {
    id: 'birthday',
    label: 'วันเกิด',
    emoji: '🎂',
    desc: 'งานปาร์ตี้ฉลอง สนุกสนาน คัลเลอร์ฟูล',
    suggestedColorIds: ['bubblegum-pink', 'sky-blue', 'candy-grape', 'lemon-yellow'],
  },
  {
    id: 'school',
    label: 'วันเปิดเทอม',
    emoji: '🎒',
    desc: 'สุภาพ เรียบร้อย แต่ยังสดใสมั่นใจ',
    suggestedColorIds: ['midnight-navy', 'baby-blue', 'mint-green', 'pearl-silver', 'lavender'],
  },
  {
    id: 'christmas',
    label: 'คริสต์มาส',
    emoji: '🎄',
    desc: 'เขียวมรกต แดงเชอร์รี่ หรือขาวมุก',
    suggestedColorIds: ['cherry-red', 'deep-emerald', 'mint-green', 'crystal-white'],
  },
  {
    id: 'valentine',
    label: 'วาเลนไทน์',
    emoji: '💖',
    desc: 'ชมพูหวาน แดงกุหลาบ อบอวลไปด้วยรัก',
    suggestedColorIds: ['baby-pink', 'cherry-red', 'bubblegum-pink', 'lavender'],
  },
  {
    id: 'halloween',
    label: 'ฮาโลวีน',
    emoji: '🎃',
    desc: 'ส้มสด ตัดดำสนิท หรือม่วงเข้ม',
    suggestedColorIds: ['neon-coral', 'pitch-black', 'deep-plum', 'lime-green'],
  },
  {
    id: 'newyear',
    label: 'ปีใหม่',
    emoji: '🎆',
    desc: 'ฉลองเริ่มต้นสิ่งใหม่ ประกายสดใสฟันวิ้ง',
    suggestedColorIds: ['ocean-turquoise', 'rose-gold', 'midnight-navy', 'bubblegum-pink'],
  },
];

export const SHIRT_COLOR_OPTIONS = [
  {
    id: 'pink',
    label: 'ชมพู',
    hex: '#F472B6',
    desc: 'เสื้อโทนชมพู/โอรส',
    recommendedBraceColorIds: ['baby-pink', 'sky-blue', 'lavender', 'mint-green'],
    adviceTh: 'จับคู่กับฟ้าพาสเทลเพื่อความตัดกันน่ารัก หรือชมพู-ม่วงคุมโทนหวาน',
  },
  {
    id: 'blue',
    label: 'ฟ้า / ยีนส์',
    hex: '#60A5FA',
    desc: 'เสื้อฟ้า คราม หรือเดนิม',
    recommendedBraceColorIds: ['bubblegum-pink', 'butter-yellow', 'crystal-white', 'ocean-turquoise'],
    adviceTh: 'ยางสีชมพูหรือเหลืองพาสเทลจะช่วยให้รอยยิ้มป๊อปเด่นขึ้นมาทันที',
  },
  {
    id: 'yellow',
    label: 'เหลือง',
    hex: '#FBBF24',
    desc: 'เสื้อเหลืองมัสตาร์ด/พาสเทล',
    recommendedBraceColorIds: ['bubblegum-pink', 'sky-blue', 'midnight-navy', 'lavender'],
    adviceTh: 'สียางโทนฟ้า ม่วง หรือชมพู ช่วยบาลานซ์ไม่ให้ฟันดูกลืนกับสีเสื้อ',
  },
  {
    id: 'green',
    label: 'เขียว',
    hex: '#34D399',
    desc: 'เสื้อเขียวพาสเทล/เซจ',
    recommendedBraceColorIds: ['peach-coral', 'baby-pink', 'crystal-white', 'mint-green'],
    adviceTh: 'ยางสีพีชหรือชมพูอ่อนตัดกับเขียวได้อย่างละมุนตามาก',
  },
  {
    id: 'purple',
    label: 'ม่วง',
    hex: '#A78BFA',
    desc: 'เสื้อม่วงลาเวนเดอร์/ทาร็อต',
    recommendedBraceColorIds: ['sky-blue', 'butter-yellow', 'mint-green', 'bubblegum-pink'],
    adviceTh: 'ฟ้าหรือมิ้นต์คู่กับเสื้อม่วง ให้ฟีลไอศกรีมพาสเทลสุดคิ้วท์',
  },
  {
    id: 'red',
    label: 'แดง',
    hex: '#F87171',
    desc: 'เสื้อแดง/เลือดหมู',
    recommendedBraceColorIds: ['midnight-navy', 'pitch-black', 'crystal-white', 'cherry-red'],
    adviceTh: 'ยางสีกรมท่าหรือขาวช่วยดรอปความร้อนแรง และทำให้ฟันดูขาวยิ่งขึ้น',
  },
  {
    id: 'black',
    label: 'ดำ',
    hex: '#374151',
    desc: 'เสื้อดำคลาสสิก/สตรีท',
    recommendedBraceColorIds: ['bubblegum-pink', 'ocean-turquoise', 'lime-green', 'pearl-silver'],
    adviceTh: 'ใส่เสื้อดำ สียางจัดฟันสีนีออนหรือพาสเทลสดๆ จะเด่นกระแทกตามาก!',
  },
  {
    id: 'white',
    label: 'ขาว',
    hex: '#E5E7EB',
    desc: 'เสื้อขาว/นักเรียน/คลีน',
    recommendedBraceColorIds: ['sky-blue', 'baby-pink', 'midnight-navy', 'lavender'],
    adviceTh: 'เสื้อขาวเข้าได้กับทุกสี! ลองคู่สีทูโทนฟ้า-ชมพูจะดูสดใสสุดๆ',
  },
  {
    id: 'navy',
    label: 'กรมท่า',
    hex: '#1E3A8A',
    desc: 'ชุดนักเรียน/สีกรมท่า',
    recommendedBraceColorIds: ['baby-pink', 'sky-blue', 'mint-green', 'rose-gold'],
    adviceTh: 'สียางสีสว่างหรือพาสเทล จะช่วยขับใบหน้าให้ดูสว่างขึ้นแม้ใส่สีกรมท่า',
  },
  {
    id: 'beige',
    label: 'ครีม / เบจ',
    hex: '#D97706',
    desc: 'เสื้อเอิร์ธโทน มินิมอล',
    recommendedBraceColorIds: ['sage-green', 'peach-coral', 'lavender', 'crystal-white'],
    adviceTh: 'ยางสีเอิร์ธโทนอย่างเซจหรือพีช ช่วยคุมมู้ดมินิมอลสไตล์คาเฟ่',
  },
];

// Curated Popular Color Pairs
export const CURATED_PALETTES: CuratedPalette[] = [
  {
    id: 'bubblegum-sky',
    titleTh: 'Pink + Blue (คอตตอนแคนดี้)',
    titleEn: 'Bubblegum Pop',
    category: 'sweet',
    colors: [
      getColorById('bubblegum-pink')!,
      getColorById('sky-blue')!,
    ],
    descriptionTh: 'คู่สีระดับตำนานอันดับ 1 ตลอดกาล! ให้ฟีลขนมสายไหม สดใส ขี้เล่น น่ารักแบบตะโกน',
    tags: ['ยอดฮิต', 'น่ารัก', 'Y2K'],
    score: {
      harmony: 10,
      vibrancy: 9,
      cuteness: 10,
      skinCompliment: 9,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกสดใส ขี้เล่น และน่ารักสุดพลัง',
    },
    recommendedFor: 'เหมาะสำหรับทุกวัน และคนที่อยากได้รอยยิ้มสดใสเป็นกันเอง',
  },
  {
    id: 'lavender-mint',
    titleTh: 'Purple + Mint (แฟรี่เทลการ์เด้น)',
    titleEn: 'Fairy Tale Garden',
    category: 'sweet',
    colors: [
      getColorById('lavender')!,
      getColorById('mint-green')!,
    ],
    descriptionTh: 'โทนพาสเทลชวนฝัน สบายตา ละมุนละไม ยิ้มแล้วดูสุภาพแต่มีกิมมิคพิเศษ',
    tags: ['พาสเทล', 'ละมุน', 'มินิมอล'],
    score: {
      harmony: 9,
      vibrancy: 7,
      cuteness: 10,
      skinCompliment: 8,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกนุ่มนวล สบายตา และมีเสน่ห์อ่อนหวาน',
    },
    recommendedFor: 'เหมาะกับสายหวาน เรียบร้อย ใส่ไปโรงเรียนได้ไม่ฉูดฉาด',
  },
  {
    id: 'purple-blue',
    titleTh: 'Purple + Blue (ทไวไลท์ดรีม)',
    titleEn: 'Twilight Dream',
    category: 'cool',
    colors: [
      getColorById('royal-purple')!,
      getColorById('baby-blue')!,
    ],
    descriptionTh: 'สีท้องฟ้ายามค่ำคืน ม่วงเข้มตัดฟ้าอ่อน ขับฟันให้ดูขาววิ้งสะท้อนแสง',
    tags: ['ขับฟันขาว', 'เท่', 'ลึกลับ'],
    score: {
      harmony: 9,
      vibrancy: 8,
      cuteness: 8,
      skinCompliment: 10,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกลึกลับ น่าค้นหา และช่วยขับฟันให้ดูขาวขึ้น',
    },
    recommendedFor: 'คนที่อยากให้ฟันดูขาวสะอาด และชอบโทนเย็น',
  },
  {
    id: 'green-white',
    titleTh: 'Green + White (คลีนมินต์เฟรช)',
    titleEn: 'Clean Mint & White',
    category: 'minimal',
    colors: [
      getColorById('mint-green')!,
      getColorById('crystal-white')!,
    ],
    descriptionTh: 'เขียวมิ้นต์คู่ขาวมุก สะอาด สดชื่น ฟีลลิ่งยาสีฟันธรรมชาติ ยิ้มสดชื่นตลอดวัน',
    tags: ['คลีน', 'มินิมอล', 'สดชื่น'],
    score: {
      harmony: 10,
      vibrancy: 6,
      cuteness: 9,
      skinCompliment: 9,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกสะอาด เรียบง่าย สดชื่น และสบายตา',
    },
    recommendedFor: 'สายมินิมอล หรือคนที่ต้องการความสุภาพ',
  },
  {
    id: 'red-black',
    titleTh: 'Red + Black (แวมไพร์ชิค)',
    titleEn: 'Vampire Chic',
    category: 'dark',
    colors: [
      getColorById('cherry-red')!,
      getColorById('pitch-black')!,
    ],
    descriptionTh: 'แดงทับทิมตัดดำสนิท คมเข้ม เท่ มีเสน่ห์แบบตัวแม่ มั่นใจทุกองศา',
    tags: ['เท่', 'ดาร์ก', 'ฮาโลวีน'],
    score: {
      harmony: 9,
      vibrancy: 9,
      cuteness: 6,
      skinCompliment: 9,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกเท่ มั่นใจ ดุดัน และมีเสน่ห์คมชัด',
    },
    recommendedFor: 'สายร็อค สตรีทแฟชั่น หรือเทศกาลฮาโลวีน',
  },
  {
    id: 'yellow-pink',
    titleTh: 'Yellow + Pink (ซันนี่เดซี่)',
    titleEn: 'Sunny Daisy',
    category: 'bright',
    colors: [
      getColorById('butter-yellow')!,
      getColorById('baby-pink')!,
    ],
    descriptionTh: 'ชมพูพาสเทลคู่เหลืองเนย ละมุนเหมือนดอกเดซี่กลางแดดอ่อนๆ เพิ่มพลังบวก',
    tags: ['สดใส', 'ดอกไม้', 'ขี้เล่น'],
    score: {
      harmony: 9,
      vibrancy: 9,
      cuteness: 10,
      skinCompliment: 8,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกอบอุ่น สดใส ขี้เล่น อารมณ์ดีตลอดวัน',
    },
    recommendedFor: 'คนที่อยากเติมพลังความสุขและรอยยิ้มหวานๆ',
  },
  {
    id: 'navy-silver',
    titleTh: 'Navy + Silver (สมาร์ทแคชชวล)',
    titleEn: 'Smart Navy & Silver',
    category: 'cool',
    colors: [
      getColorById('midnight-navy')!,
      getColorById('pearl-silver')!,
    ],
    descriptionTh: 'สีกรมท่าตัดสีเงิน เมทัลลิก คลาสสิก ไม่ติดคราบแกงเหลือง ฟันดูขาวเด่น',
    tags: ['ฟันขาว', 'ไม่ติดคราบ', 'คูล'],
    score: {
      harmony: 10,
      vibrancy: 6,
      cuteness: 7,
      skinCompliment: 10,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกเท่ สุภาพ มั่นใจ ดูแลรักษาง่ายที่สุด',
    },
    recommendedFor: 'นักเรียน นักศึกษา หรือคนที่ชอบกินแกงกะหรี่/ชา/กาแฟ',
  },
  {
    id: 'christmas-duo',
    titleTh: 'Red + Emerald (คริสต์มาสเมจิก)',
    titleEn: 'Christmas Magic',
    category: 'bright',
    colors: [
      getColorById('cherry-red')!,
      getColorById('deep-emerald')!,
    ],
    descriptionTh: 'แดงเชอร์รี่ตัดเขียวมรกต เทศกาลคริสต์มาสและปีใหม่สุดครึกครื้น',
    tags: ['คริสต์มาส', 'เทศกาล', 'สดใส'],
    score: {
      harmony: 9,
      vibrancy: 10,
      cuteness: 8,
      skinCompliment: 9,
      overallFeeling: 'คู่สีนี้ให้ความรู้สึกเทศกาล อบอุ่น มีชีวิตชีวา และสนุกสนาน',
    },
    recommendedFor: 'ช่วงเทศกาลปลายปี ธันวาคม-มกราคม',
  },
];

export function getColorById(id: string): BraceColor | undefined {
  return BRACE_COLORS.find((c) => c.id === id);
}

// Calculate harmonic score between 1-3 colors
export function calculateColorScore(colors: BraceColor[]): ColorScore {
  if (colors.length === 0) {
    return {
      harmony: 8,
      vibrancy: 8,
      cuteness: 8,
      skinCompliment: 8,
      overallFeeling: 'สียางจัดฟันดูสดใสและเป็นเอกลักษณ์',
    };
  }

  if (colors.length === 1) {
    const c = colors[0];
    const isPastel = c.category === 'pastel';
    const isDark = c.category === 'dark';
    const isVibrant = c.category === 'vibrant' || c.category === 'neon';

    const harmony = 10;
    const cuteness = isPastel ? 10 : isVibrant ? 8 : 6;
    const vibrancy = isVibrant ? 10 : isPastel ? 7 : 5;
    const skinCompliment = isDark ? 10 : isPastel ? 8 : 7;

    return {
      harmony,
      vibrancy,
      cuteness,
      skinCompliment,
      overallFeeling: isPastel
        ? `สี ${c.nameTh} ให้ความรู้สึกหวานละมุน นุ่มนวล ชวนมอง`
        : isDark
        ? `สี ${c.nameTh} ขับฟันให้ดูขาวเด่น เท่ มั่นใจ ไม่ติดคราบสีอาหารง่าย`
        : `สี ${c.nameTh} สดใสสะดุดตา เสริมพลังรอยยิ้มให้เปล่งประกาย`,
    };
  }

  // Duo or Trio
  const hasPastel = colors.some((c) => c.category === 'pastel');
  const hasVibrant = colors.some((c) => c.category === 'vibrant' || c.category === 'neon');
  const hasDark = colors.some((c) => c.category === 'dark');
  const hasCool = colors.some((c) => c.styleTags.includes('cool'));

  let harmony = 9;
  let vibrancy = 8;
  let cuteness = 8;
  let skinCompliment = 8;

  if (hasPastel && colors.every((c) => c.category === 'pastel' || c.category === 'neutral')) {
    cuteness = 10;
    harmony = 10;
    vibrancy = 7;
    skinCompliment = 8;
  } else if (hasDark && colors.some((c) => c.category === 'pastel' || c.category === 'metallic')) {
    skinCompliment = 10;
    harmony = 9;
    vibrancy = 8;
    cuteness = 7;
  } else if (hasVibrant) {
    vibrancy = 9 + (colors.length > 2 ? 1 : 0);
    cuteness = 9;
    harmony = 8;
  }

  const names = colors.map((c) => c.nameTh).join(' และ ');
  const desc = cuteness >= 9
    ? `คู่สี ${names} ให้ความรู้สึกสดใสและน่ารักมาก เข้ากันได้อย่างลงตัว`
    : skinCompliment >= 9
    ? `การจับคู่ ${names} ช่วยขับรอยยิ้มให้คมชัด ฟันดูขาวสะอาดและมีสไตล์`
    : `คู่สี ${names} ให้พลังงานกระปรี้กระเปร่า มีเอกลักษณ์ไม่ซ้ำใคร`;

  return {
    harmony,
    vibrancy,
    cuteness,
    skinCompliment,
    overallFeeling: desc,
  };
}
