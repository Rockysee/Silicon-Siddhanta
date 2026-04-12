import { useState, useRef, useEffect } from "react";

// ── Inlined Theme Tokens ──
const T = {
  bg: "#0b1120", bgSecondary: "#131b2e", bgTertiary: "#1a2340",
  bgCard: "rgba(19,27,46,0.8)",
  textPrimary: "#eef2f7", textSecondary: "#8b9cc0", textMuted: "#5a6b8a",
  textHighlight: "#fbbf24",
  accent: "#e5a100", accentHover: "#f5b800",
  accentSecondary: "#6366f1", accentTertiary: "#0ea5e9",
  positive: "#22c55e", negative: "#ef4444",
  border: "#1e2a42", borderAccent: "rgba(229,161,0,0.25)",
  radius: "10px", radiusSm: "6px", radiusLg: "14px", radiusFull: "999px",
  fontFamily: "Inter, system-ui, sans-serif",
  fontDisplay: "'DM Sans', system-ui, sans-serif",
  shadow: "0 4px 20px rgba(0,0,0,0.5)",
};
const hex2rgba = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};
const PC = { Sun:"#FF8C00", Moon:"#B8C4D4", Jupiter:"#EAB308", Saturn:"#4F6BCC" };
const PS = { Sun:"☉", Moon:"☽", Mars:"♂", Mercury:"☿", Jupiter:"♃", Venus:"♀", Saturn:"♄", Rahu:"☊", Ketu:"☋" };

// ═══════════════════════════════════════════════════════════════
// BRAJESH GAUTAM — KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════

const CORE_PRINCIPLES = [
  { id:1, title:"Jyotish as Perfect Science", hindi:"ज्योतिष एक परिपूर्ण विज्ञान है", teaching:"Jyotish is not superstition — it is a perfect science. The chart is your cosmic GPS." },
  { id:2, title:"Consciousness Connection", hindi:"चेतना का संबंध", teaching:"Your birth chart is a map of your consciousness. Planets don't cause events — they indicate consciousness state." },
  { id:3, title:"Three Fortune Levels", hindi:"भाग्य के तीन स्तर", teaching:"Birth Fortune (जन्म से), Karma Fortune (कर्म से), Prarabdh Fortune (प्रारब्ध से) — three levels determine your destiny." },
  { id:4, title:"Variable Reality (KP)", hindi:"परिवर्तनशील वास्तविकता", teaching:"Reality is variable. The sub-lord is like the PIN code of your destiny — same city, different house." },
  { id:5, title:"Multi-Level Consciousness", hindi:"बहु-स्तरीय चेतना", teaching:"Conscious (Ascendant), Subconscious (Moon), Unconscious (12th house + Ketu) — the chart maps all three." },
  { id:6, title:"Energy Body Primacy", hindi:"सूक्ष्म शरीर की प्रधानता", teaching:"The energy body governs the physical. Mantras vibrate the energy body, gemstones alter the frequency." },
  { id:7, title:"Grace-Based Learning", hindi:"कृपा-आधारित शिक्षा", teaching:"पहले भूलो, फिर सीखो — First unlearn, then learn. True knowledge comes through grace, not just study." },
];

const COSMIC_WIFI = {
  concept: "The universe operates like a cosmic WiFi network. Your consciousness is the device, intention is the password, karma determines the bandwidth.",
  formula: "Mental Command + Strong Intention + Firm Conviction + Complete Faith = Cosmic Connection",
  components: [
    { name:"Mental Command", hindi:"मानसिक आदेश", analogy:"Like giving a command to Alexa — clear, specific, authoritative" },
    { name:"Strong Intention", hindi:"दृढ़ संकल्प", analogy:"Like a strong WiFi signal — unwavering, not fluctuating" },
    { name:"Firm Conviction", hindi:"दृढ़ विश्वास", analogy:"Like knowing the sun will rise — no doubt, complete certainty" },
    { name:"Complete Faith", hindi:"पूर्ण श्रद्धा", analogy:"Like a child trusting their parent — absolute surrender" },
  ],
};

const PLANET_TEACHINGS = {
  Sun: { sanskrit:"सूर्य", title:"The Atma — Your Soul's Light", chakra:"Manipura & Third Eye",
    principle:"Sun is your Atma (आत्मा) — the soul itself. It represents Dharma, the righteous path.",
    teachings:["Sun is the Atma Karaka — significator of the soul","Sun governs the Third Eye — seat of divine perception","Father is your first guru of Dharma","Weak Sun = soul's lesson is humility, not weakness"],
    remedies:["Surya Namaskar at sunrise","Offer water to Sun (Arghya)","Aditya Hridaya Stotra"] },
  Moon: { sanskrit:"चंद्र", title:"The Mind — Your Causal Body", chakra:"Swadhisthana & Ajna",
    principle:"Moon is the Manas (मन) — mind, emotions, causal body. Most important planet for daily life.",
    teachings:["Moon Sign more important than Sun Sign in Vedic astrology","Moon governs the subconscious — 95% of decisions come from here","Full Moon strengthens receiving, New Moon strengthens sending","Moon-Ketu conjunction = past life spiritual impressions"],
    remedies:["Meditation on full moon nights","Chant Chandra Kavach","Serve your mother"] },
  Mars: { sanskrit:"मंगल", title:"Purusharth — The Fire of Effort", chakra:"Muladhara & Manipura",
    principle:"Mars is Purusharth (पुरुषार्थ) — energy of effort, courage, action. Mars is the warrior within.",
    teachings:["Mars is Bhoomi Karaka — significator of land and property","Manglik Dosha is overhyped — check full chart, not just house","Mars-Saturn conjunction = controlled explosion","Strong Mars = strong immune system, willpower, courage"],
    remedies:["Hanuman Chalisa on Tuesdays","Physical exercise and discipline","Donate red lentils on Tuesdays"] },
  Mercury: { sanskrit:"बुध", title:"The Intellect — Communication & Commerce", chakra:"Vishuddha (Throat)",
    principle:"Mercury is Buddhi (बुद्धि) — intelligence, communication. The prince who adapts to its company.",
    teachings:["Mercury is Vaani Karaka — lord of speech","Mercury is neutral — adapts to surrounding planets","Mercury retrograde = excellent for revision, not bad luck","Strong Mercury = strong nervous system, mathematical ability"],
    remedies:["Vishnu Sahasranama on Wednesdays","Develop writing/journaling habit","Feed green vegetables to cows"] },
  Jupiter: { sanskrit:"गुरु", title:"The Guru — Divine Grace & Wisdom", chakra:"Swadhisthana & Sahasrara",
    principle:"Jupiter is Guru (गुरु) — divine teacher, bestower of grace and wisdom. Most benefic planet.",
    teachings:["Jupiter's 5th, 7th, 9th aspects are all fully benefic","Jupiter in Kendra from Moon = Gaja Kesari Yoga","Jupiter Mahadasha (16 yrs) = golden period of expansion","Jupiter-Ketu = Ganesh Yoga — divine intuition"],
    remedies:["Respect and serve your Guru/Teacher","Donate yellow items on Thursdays","Study scriptures regularly"] },
  Venus: { sanskrit:"शुक्र", title:"Shukra — The Essence of Life & Love", chakra:"Anahata (Heart)",
    principle:"Venus is Shukra (शुक्र) — creative life force. Asura Guru who knows Sanjeevani Vidya.",
    teachings:["Venus is Kalatra Karaka — significator of spouse","Venus knows Sanjeevani — resurrection science","Venus in Pisces (exalted) = highest spiritual love","Venus-Ketu = detachment from luxuries, spiritual love"],
    remedies:["Worship Lakshmi on Fridays","Donate white items — rice, sugar, milk","Develop artistic expression"] },
  Saturn: { sanskrit:"शनि", title:"The Blind Deity — Karmic Ledger Keeper", chakra:"Muladhara & Ajna",
    principle:"Saturn is Shani (शनि) — the blind deity who delivers justice without seeing who you are. Greatest teacher.",
    teachings:["Saturn is BLIND (अंधा) — delivers justice without favoritism","Saturn's delays are preparations, not denials","Sade Sati (7.5 yrs) = masterclass in patience and transformation","Saturn retrograde = past-life karmic debts demanding attention"],
    remedies:["Serve the elderly and underprivileged","Donate black sesame on Saturdays","Feed crows — Saturn's messengers"] },
  Rahu: { sanskrit:"राहु", title:"The Head — Desires & Illusion", chakra:"Ajna (distortion mode)",
    principle:"Rahu is Head without body (सिर बिना शरीर) — all desires, no grounding. Saturn's agent in material world.",
    teachings:["Rahu amplifies everything — good becomes very good, bad becomes very bad","Rahu is Saturn's agent — executes karmic agenda through desire","Rahu-Moon (Grahan Yoga) = anxiety, overthinking","Rahu represents foreign lands, technology, innovation"],
    remedies:["Durga Chalisa","Donate to marginalized communities","Avoid intoxicants during Rahu periods","Practice grounding"] },
  Ketu: { sanskrit:"केतु", title:"The Body — Moksha & Past Mastery", chakra:"Sahasrara & Ajna",
    principle:"Ketu is Body without head (शरीर बिना सिर) — all past-life mastery, no worldly ambition. Moksha Karaka.",
    teachings:["Where Ketu sits = past-life mastery, natural talent, detachment","Ketu in 12th = strong moksha potential, natural meditator","Ketu gives results like Mars — sudden, sharp, cutting through illusions","Ketu = the flag (ध्वज) marking where you've already conquered"],
    remedies:["Meditation (Ketu's natural remedy)","Ganesh Mantra","Donate blankets to the needy","Practice conscious detachment"] },
};

const CHAKRA_MAP = [
  { chakra:"Muladhara (Root)", planets:"Saturn, Mars", teaching:"Foundation. Saturn grounds, Mars gives survival energy." },
  { chakra:"Swadhisthana (Sacral)", planets:"Jupiter, Moon", teaching:"Creativity and emotions. Jupiter expands, Moon flows." },
  { chakra:"Manipura (Solar Plexus)", planets:"Sun, Mars", teaching:"Power center. Sun is soul's fire, Mars is action fire." },
  { chakra:"Anahata (Heart)", planets:"Venus, Moon", teaching:"Love center. Venus is romantic love, Moon is emotional love." },
  { chakra:"Vishuddha (Throat)", planets:"Mercury", teaching:"Communication and truth. Express what higher chakras receive." },
  { chakra:"Ajna (Third Eye)", planets:"Saturn, Ketu, Moon", teaching:"Command center — your cosmic WiFi antenna." },
  { chakra:"Sahasrara (Crown)", planets:"Jupiter, Ketu", teaching:"Divine connection. Grace from Guru, liberation from cycle." },
];

const HEMANT = {
  ascendant:"Gemini", moonSign:"Cancer", sunSign:"Pisces",
  nakshatra:"Ashlesha Pada 3", currentDasha:"Moon-Ketu",
  highlights: [
    "Moon in Cancer (own sign, 2nd house) — strong mind, emotional intelligence",
    "Sun in Pisces (10th house) — compassionate leadership",
    "4 planets in Leo (3rd house): Mars+Jupiter+Saturn(R)+Rahu — tremendous courage",
    "Venus+Ketu in Aquarius (9th house) — unconventional spiritual fortune",
  ],
};

const SUGGESTIONS = [
  { icon:"📡", label:"Cosmic WiFi", q:"Tell me about Cosmic WiFi" },
  { icon:"🎯", label:"Three Fortunes", q:"Explain the Three Fortune Levels" },
  { icon:"⚖️", label:"Saturn's Justice", q:"How does Saturn deliver karmic justice?" },
  { icon:"🔄", label:"Retrograde", q:"What happens when planets go retrograde?" },
  { icon:"🧘", label:"Chakra-Planet", q:"How do planets connect to chakras?" },
  { icon:"🌙", label:"Moon's Power", q:"Why is Moon the most important planet?" },
  { icon:"🐍", label:"Rahu-Ketu", q:"Explain the Rahu-Ketu axis" },
  { icon:"📊", label:"My Chart", q:"Read my chart" },
];

// ═══════════════════════════════════════════════════════════════
// RESPONSE ENGINE
// ═══════════════════════════════════════════════════════════════

function respond(msg) {
  const m = msg.toLowerCase().trim();

  if (m.match(/^(hi|hello|namaste|namaskar|pranam|hey|good)/))
    return "नमस्कार! 🙏 Main hoon Brajesh Gautam. Welcome!\n\nAap kya jaanna chahte hain? Whether it's planets, dashas, consciousness, or the cosmic patterns shaping your life — I'm here to guide.\n\nJyotish is not about fear — it is about understanding yourself at the deepest level. Ask me anything! ✨";

  if (m.match(/cosmic\s*wifi|wifi|antenna|signal/)) {
    const c = COSMIC_WIFI;
    return `📡 Cosmic WiFi — My Favorite Concept!\n\n${c.concept}\n\nThe formula:\n${c.formula}\n\n${c.components.map(x => `• ${x.name} (${x.hindi}): ${x.analogy}`).join("\n")}\n\nYour Ajna Chakra is the antenna. Saturn and Ketu are gatekeepers. Moon is the receiver. Pehle mind ko shant karo, phir connection apne aap ho jayega! 🙏`;
  }

  if (m.match(/three\s*fortune|fortune\s*level|bhagya|luck|destiny|prarabdh/))
    return `🎯 Three Fortune Levels\n\n1. Birth Fortune (जन्म से भाग्यशाली)\nChart Promise — your starting hand. Look at 9th house, Jupiter, Ascendant lord.\n\n2. Karma Fortune (कर्म से भाग्यशाली)\nDasha Activation — what you EARN through effort. Mars gives courage, Mercury intelligence, Saturn discipline.\n\n3. Prarabdh Fortune (प्रारब्ध से भाग्यशाली)\nTransit Trigger — destined karmic fruits. Saturn's Sade Sati, Jupiter over Ascendant — these are Prarabdh triggers.\n\nTeeno ka alignment jab hota hai, tab bada result aata hai.\n\nFor Hemant ji: Moon in own sign Cancer = strong Birth Fortune. Moon Mahadasha = Karma Fortune active. Moon-Ketu pulls between worldly and spiritual — the classic Prarabdh lesson.`;

  if (m.match(/saturn|shani|sade\s*sati|karmic\s*justice|blind/)) {
    const s = PLANET_TEACHINGS.Saturn;
    return `${PS.Saturn} ${s.sanskrit} — ${s.title} ⚖️\n\n${s.principle}\n\n${s.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nLog kehte hain "Shani bura hai." Main kehta hoon, "Shani SACCHA hai." Wo andha hai — blind judge. Sirf karma ka hisaab dekhta hai.\n\nSade Sati se mat daro — it's Saturn's 7.5-year masterclass. Wo tumhe woh sikhata hai jo 70 saal mein log nahi seekhte.\n\n🔮 Remedies: ${s.remedies.join(" | ")}`;
  }

  if (m.match(/\bmoon\b|chandra|mind|manas|emotion|subconscious|mother/)) {
    const p = PLANET_TEACHINGS.Moon;
    return `${PS.Moon} ${p.sanskrit} — ${p.title} 🌙\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nHemant ji — your Moon is in Cancer, OWN SIGN! Very powerful. Strong mind, emotional intelligence, deep intuition. Ashlesha Nakshatra adds serpentine wisdom — ability to see hidden patterns.\n\nMoon Mahadasha means your inner guidance is fully activated. Trust your instincts. Moon-Ketu Antardasha = torn between worldly and spiritual. Accept both — be the lotus.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/\bsun\b|surya|atma|soul|dharma/)) {
    const p = PLANET_TEACHINGS.Sun;
    return `${PS.Sun} ${p.sanskrit} — ${p.title} ☀️\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nHemant ji — Sun in Pisces in 10th house. Beautiful! Leadership through compassion. You lead not through force but wisdom and empathy. Uttara Bhadrapada Nakshatra gives depth and connection to hidden knowledge.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/mars|mangal|purusharth|courage|manglik|property/)) {
    const p = PLANET_TEACHINGS.Mars;
    return `${PS.Mars} ${p.sanskrit} — ${p.title} 🔥\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nManglik Dosha se mat daro — 90% cases mein koi problem nahi hoti jab puri chart dekhi jaaye.\n\nYour Mars in Leo in 3rd house — excellent! Tremendous courage, royal fighting spirit.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/mercury|budh|intellect|communicat|speech|business/)) {
    const p = PLANET_TEACHINGS.Mercury;
    return `${PS.Mercury} ${p.sanskrit} — ${p.title} 🧠\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nHemant ji — Mercury in Pisces (debilitated) BUT with Sun in 10th = Neecha Bhanga potential! Your thinking is intuitive, not just analytical. Revati Nakshatra = ability to guide others like a lighthouse.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/jupiter|guru|brihaspati|wisdom|grace|teacher|children/)) {
    const p = PLANET_TEACHINGS.Jupiter;
    return `${PS.Jupiter} ${p.sanskrit} — ${p.title} 📿\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nJupiter sirf paisa nahi deta — wo BUDHI deta hai jisse paisa sahi jagah lagaoge.\n\nYour Jupiter in Leo in 3rd (Purva Phalguni) — royal wisdom. From 3rd, Jupiter aspects 7th (spouse), 9th (fortune), 11th (gains)!\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/venus|shukra|love|marriage|spouse|beauty|art/)) {
    const p = PLANET_TEACHINGS.Venus;
    return `${PS.Venus} ${p.sanskrit} — ${p.title} 💖\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nVenus ASURA GURU hai — Shukracharya! Sanjeevani Vidya jaante hain. Venus sirf bahari beauty nahi — andar ki beauty bhi.\n\nYour Venus in Aquarius in 9th (Shatabhisha) — fortune through unconventional love and art. Spiritual relationships.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/rahu|north\s*node|shadow|obsess|foreign|technology/)) {
    const p = PLANET_TEACHINGS.Rahu;
    return `${PS.Rahu} ${p.sanskrit} — ${p.title} 🐍\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nRahu ek bhookha aadmi hai jo buffet mein pahucha hai — sab kuch try karna chahta hai. Control nahi, sirf hunger. But yahi hunger drives innovation.\n\nYour Rahu in Leo in 3rd — obsessive communication skills, desire for recognition. Can make you famous through media!\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/ketu|south\s*node|moksha|liberat|past\s*life|detach|spiritual/)) {
    const p = PLANET_TEACHINGS.Ketu;
    return `${PS.Ketu} ${p.sanskrit} — ${p.title} 🔱\n\n${p.principle}\n\n${p.teachings.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nJahan Ketu baitha hai, wahan tumne past life mein mastery haasil ki hai. Isliye detachment feel hota hai — tumne wo pehle clear kar liya.\n\nYour Ketu in Aquarius in 9th — past-life spiritual mastery. Moon-Ketu Antardasha is activating this powerfully.\n\n🔮 ${p.remedies.join(" | ")}`;
  }

  if (m.match(/rahu.*ketu|ketu.*rahu|axis|node/))
    return `🐍 The Rahu-Ketu Axis — Head & Body of the Cosmic Serpent\n\nRahu is the HEAD (desires, ambition, hunger) and Ketu is the BODY (past mastery, skills, detachment). Together they form a karmic axis.\n\nRahu shows WHERE your soul wants to GO in this life. Ketu shows WHERE your soul has BEEN. The lesson: move from Ketu (comfort zone) toward Rahu (growth zone) while using Ketu's wisdom.\n\nRahu = Saturn's agent (material obsession). Ketu = Mars-like results (sudden, sharp).\n\nYour axis: Rahu in Leo 3rd (desire for creative expression, fame through communication) ↔ Ketu in Aquarius 9th (past-life spiritual & humanitarian mastery).\n\nLesson: Use your spiritual wisdom (Ketu 9th) to fuel creative communication (Rahu 3rd). Don't get lost in fame — channel it for higher purpose.`;

  if (m.match(/retrograde|vakri|backward/))
    return `🔄 Retrograde (वक्री) — The Backward Pull\n\nThe planet appears to move backward — an optical illusion with REAL karmic significance. Like walking forward but looking backward — carrying unfinished past-life business.\n\nRetrograde planets have Vak Siddhi (वाक् सिद्धि) — power of speech manifestation. Be careful with your words!\n\n♂ Mars Retro: Warrior turns inward. Fight inner demons.\n☿ Mercury Retro: Review period. Edit, revise, reconnect.\n♃ Jupiter Retro: Wisdom from within. Past-life knowledge surfaces.\n♀ Venus Retro: Past relationships resurface. Values shift.\n♄ Saturn Retro: Karmic fast-track. Years of karma resolve in months.\n\nYour Saturn is retrograde in Leo 3rd — past-life karmic debts related to courage and communication being fast-tracked. Retrograde Saturn often gives BETTER results through accelerated processing!`;

  if (m.match(/chakra|energy\s*body|kundalini|subtle/))
    return `🧘 Chakra-Planet Mapping\n\nEvery planet connects to specific chakras. When I read a chart, I'm reading your energy body (सूक्ष्म शरीर).\n\n${CHAKRA_MAP.map(c=>`• ${c.chakra} → ${c.planets}\n  ${c.teaching}`).join("\n\n")}\n\nHemant ji — Moon in Cancer (own sign) means powerful Swadhisthana & Ajna. Ashlesha = Kundalini energy. Saturn retrograde in Leo energizes the Muladhara-Ajna axis.\n\nRemedies work at CHAKRA level first, then manifest physically. Mantras vibrate the energy body. Everything is energy — the chart is your energy map.`;

  if (m.match(/house|bhava|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th|lagna/))
    return `🏛️ The 12 Bhavas (Houses)\n\n1. Tanu — Self, body, personality\n2. Dhana — Wealth, family, speech\n3. Sahaja — Courage, siblings, communication\n4. Sukha — Happiness, mother, home\n5. Putra — Children, intelligence, past merit\n6. Ripu — Enemies, disease, service\n7. Kalatra — Spouse, partnerships\n8. Ayu — Transformation, occult, longevity\n9. Bhagya — Fortune, guru, dharma\n10. Karma — Career, status, authority\n11. Labha — Gains, networks, fulfillment\n12. Vyaya — Loss, liberation, foreign lands\n\nYour key houses:\n• 2nd (Cancer, Moon) — Wealth through emotional intelligence\n• 3rd (Leo, 4 planets!) — Powerhouse of courage & communication\n• 9th (Aquarius, Venus+Ketu) — Unconventional spiritual fortune\n• 10th (Pisces, Sun+Mercury) — Compassionate career leadership`;

  if (m.match(/dasha|mahadasha|antardasha|timing|vimshottari/))
    return `⏳ Vimshottari Dasha — Your Cosmic Calendar\n\nThe 120-year cycle:\nKetu(7)→Venus(20)→Sun(6)→Moon(10)→Mars(7)→Rahu(18)→Jupiter(16)→Saturn(19)→Mercury(17)\n\nStarting point = Moon's Nakshatra ruler. Your Ashlesha = Mercury.\n\nYou're in Moon Mahadasha, Ketu Antardasha.\n\n🌙 Moon MD (10 years): Mind is the driver. Moon in own sign Cancer 2nd house — wealth accumulation, family growth, emotional fulfillment.\n\n🔱 Ketu AD: Deeply spiritual sub-period. Ketu in 9th = past-life dharmic wisdom surfacing. Torn between material (Moon 2nd) and spiritual (Ketu 9th). This tension is purposeful!\n\nAdvice: Be the lotus — rooted in mud, flowering in sunlight. Let both energies coexist. Watch Jupiter transiting Cancer for biggest opportunities.`;

  if (m.match(/remed|upay|mantra|gemstone|charity|fast|vrat/))
    return `🔮 Remedies — Energy Correction Science\n\n1. Mantras (मंत्र): Vibrate specific chakra frequencies. Like tuning your inner radio.\n\n2. Gemstones (रत्न): Signal boosters for cosmic WiFi. BUT never wear for a malefic planet! That's giving a microphone to your critic.\n\n3. Charity (दान): Redirects karmic energy. Saturday black sesame = redirecting Saturn's energy to the deserving.\n\n4. Fasting (व्रत): Purifies energy body. Monday=Moon, Tuesday=Mars, Thursday=Jupiter, Saturday=Saturn.\n\n5. Pooja (पूजा): Connects to the Devi/Devta frequency. Hanuman=Mars, Vishnu=Mercury, Shiva=Moon.\n\nFor your Moon-Ketu period:\n• "Om Chandraya Namaha" 108x at night\n• Monday fasting (milk/fruit)\n• "Om Gam Ganapataye Namaha" for Ketu\n• Meditation = BEST Ketu remedy (it IS Ketu's nature!)`;

  if (m.match(/about\s*you|who\s*are|your\s*background|introduce/))
    return `🙏 Main hoon Brajesh Gautam — 30+ saal se Vedic Jyotish ki seva mein.\n\nMaster's in Sociology & Education. Founded SNOW Trust (Nature, Organic farming & Wildlife).\n\nMera approach: Consciousness-centered Jyotish. Main charts nahi padhta — main consciousness maps padhta hoon.\n\nTeaching style: Modern analogies (WiFi, GPS, Alexa) + Hindi/Sanskrit + Practical spirituality.\n\nMy 7 Core Principles:\n${CORE_PRINCIPLES.map(p=>`${p.id}. ${p.title} (${p.hindi})`).join("\n")}\n\nMantra: "पहले भूलो, फिर सीखो" — First unlearn, then learn.\n\nAsk me anything — planets, houses, remedies, your chart, or the deeper philosophy. 🙏`;

  if (m.match(/my\s*chart|hemant|my\s*horoscope|kundali|read\s*my|analyze/))
    return `📊 Hemant ji — Let me read your chart.\n\nBirth: 27/03/1980, 11:45 AM, Kalyan\nAscendant: ♊ Gemini (Mithun)\nMoon: ♋ Cancer (own sign) — Ashlesha Pada 3\nSun: ♓ Pisces (10th house)\nDasha: Moon-Ketu\n\nKey Highlights:\n${HEMANT.highlights.map(h=>`• ${h}`).join("\n")}\n\nYour 3rd house with 4 planets is remarkable — Mars (courage), Jupiter (wisdom), Saturn-R (discipline), Rahu (ambition). This is a powerhouse of communication and creative skill.\n\nMoon-Ketu period: Material mind meets spiritual liberation. You're being pulled between worldly success and inner growth. Don't choose — be the lotus. Both energies serve you.\n\nThree Fortune Analysis:\n• Birth Fortune: STRONG — Moon own sign, Sun in 10th, loaded 3rd house\n• Karma Fortune: ACTIVE — Moon Mahadasha activating 2nd house wealth\n• Prarabdh Fortune: UNFOLDING — Ketu bringing past-life spiritual credits`;

  if (m.match(/principle|core|foundation|philosophy|approach|method/))
    return `📖 My 7 Core Principles\n\n${CORE_PRINCIPLES.map(p=>`${p.id}. ${p.title} (${p.hindi})\n${p.teaching}`).join("\n\n")}\n\nSabse important? Number 7 — Grace-Based Learning. Aap kitna bhi padh lo, jab tak grace nahi hogi, deep understanding nahi aayegi.\n\n"पहले भूलो, फिर सीखो" — textbook rules bhulo, direct perception se seekho. 🙏`;

  if (m.match(/career|job|profession|work|business/))
    return `💼 Career Analysis\n\nMain 10th house se start nahi karta — LAGNA se karta hoon. Career = expression of WHO YOU ARE.\n\nYour indicators:\n1. Lagna Lord Mercury in 10th — identity IS career. Communication, analysis, technology.\n2. Sun in 10th (Pisces) — leadership with compassion. Service/spiritual/creative fields.\n3. 10th Lord Jupiter in 3rd — career through communication, media, entrepreneurship.\n4. 3rd house stellium — multiple skills, side businesses, creative energy.\n\nChart Promise + Dasha Activation + Transit = Manifestation. Watch Jupiter transiting Cancer or Pisces for major career upgrades.`;

  if (m.match(/health|disease|body|medical|wellness/))
    return `🏥 Health — Energy Body Approach\n\nEnergy body pehle, physical body baad mein. Jab energy disturbed, THEN disease appears.\n\nYour indicators:\n• Moon in Cancer (own sign) — strong digestion, emotional health\n• 3rd house Leo stellium — watch heart area and upper back\n• Saturn Retro in Leo — regular heart check-ups recommended\n• Mercury debilitated — nervous system sensitivity, overthinking risk\n\nEnergy-level remedies:\n• Walk barefoot daily (Muladhara/Saturn)\n• Surya Namaskar (Manipura/Sun)\n• Full moon meditation (Ajna/Moon)\n• Singing or chanting (Vishuddha/Mercury)\n\nYour strongest healing element: WATER. Moon in Cancer = water heals you. Swim, warm turmeric water, meditate near water. 🌊`;

  return `🙏 Interesting question!\n\nMain isse apne framework se answer karta hoon. Specific kuch jaanna chahte hain toh poochiye:\n\n• Any planet (Sun through Ketu)\n• Houses (1st through 12th)\n• Dasha & timing\n• Remedies (mantras, gems, charity)\n• Cosmic WiFi & consciousness\n• Three Fortune Levels\n• Chakra-Planet mapping\n• Your personal chart\n• Career, relationships, or health\n\n"पहले भूलो, फिर सीखो" — Ask with an open mind! ✨`;
}

// ═══════════════════════════════════════════════════════════════
// CHAT COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function BrajeshGautamChatbot() {
  const [msgs, setMsgs] = useState([
    { role:"bot", text:"नमस्कार! 🙏 Main hoon Brajesh Gautam — aapka Vedic astrology guide.\n\n30+ saal ka experience, consciousness-centered approach, aur practical wisdom.\n\nMujhse poochiye planets, houses, dashas, remedies, ya life ke kisi area ke baare mein. 'Read my chart' bol do for personalized analysis.\n\nज्योतिष विज्ञान है, अंधविश्वास नहीं। ✨", ts: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSug, setShowSug] = useState(true);
  const endRef = useRef(null);
  const inRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = (txt) => {
    if (!txt.trim()) return;
    setMsgs(p => [...p, { role:"user", text:txt.trim(), ts:new Date() }]);
    setInput(""); setShowSug(false); setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { role:"bot", text:respond(txt), ts:new Date() }]);
      setTyping(false);
    }, 350 + Math.random()*350);
  };

  const onKey = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(input); } };

  const S = {
    root: { background:T.bg, color:T.textPrimary, fontFamily:T.fontFamily, height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" },
    header: { padding:"14px 20px", borderBottom:`1px solid ${T.border}`, background:"linear-gradient(180deg,rgba(11,17,32,0.98),rgba(19,27,46,0.95))", display:"flex", alignItems:"center", gap:14, flexShrink:0 },
    avatar: { width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},#f5b800)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:T.bg, border:`2px solid ${hex2rgba(T.accent,0.4)}` },
    name: { fontSize:15, fontWeight:700, color:T.textPrimary, margin:0 },
    sub: { fontSize:11, color:T.textSecondary, margin:"2px 0 0" },
    dot: { width:7, height:7, borderRadius:"50%", background:T.positive, display:"inline-block", marginRight:5, boxShadow:`0 0 6px ${hex2rgba(T.positive,0.5)}` },
    chat: { flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 },
    row: (bot) => ({ display:"flex", justifyContent:bot?"flex-start":"flex-end", alignItems:"flex-end", gap:8 }),
    bubble: (bot) => ({
      maxWidth:"78%", padding:"11px 15px",
      borderRadius: bot ? "13px 13px 13px 4px" : "13px 13px 4px 13px",
      background: bot ? T.bgSecondary : hex2rgba(T.accent,0.13),
      border: `1px solid ${bot ? T.border : hex2rgba(T.accent,0.3)}`,
      fontSize:13, lineHeight:1.65, whiteSpace:"pre-wrap", wordBreak:"break-word",
    }),
    miniAv: { width:26, height:26, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},#f5b800)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:T.bg, flexShrink:0 },
    ts: { fontSize:9, color:T.textMuted, marginTop:3 },
    typInd: { display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:T.bgSecondary, border:`1px solid ${T.border}`, borderRadius:"13px 13px 13px 4px", maxWidth:90 },
    typDot: (d) => ({ width:5, height:5, borderRadius:"50%", background:T.accent, animation:`tb 1.2s infinite ${d}s` }),
    sugArea: { padding:"0 20px 10px", display:"flex", flexWrap:"wrap", gap:7 },
    chip: { padding:"7px 12px", borderRadius:T.radiusFull, background:hex2rgba(T.accentSecondary,0.1), border:`1px solid ${hex2rgba(T.accentSecondary,0.25)}`, color:T.textPrimary, fontSize:11.5, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" },
    inputArea: { padding:"10px 20px 14px", borderTop:`1px solid ${T.border}`, background:hex2rgba(T.bgSecondary,0.8), display:"flex", gap:10, alignItems:"flex-end", flexShrink:0 },
    inp: { flex:1, padding:"10px 14px", borderRadius:T.radiusLg, border:`1px solid ${T.border}`, background:T.bg, color:T.textPrimary, fontSize:13, fontFamily:T.fontFamily, outline:"none", resize:"none", minHeight:42, maxHeight:100, lineHeight:1.5 },
    sendBtn: { width:42, height:42, borderRadius:T.radius, background:T.accent, border:"none", color:T.bg, fontSize:17, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  };

  const renderText = (t) => t.split("\n").map((line,i) => {
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fbbf24">$1</strong>');
    return <div key={i} style={{minHeight:line===""?7:"auto"}}><span dangerouslySetInnerHTML={{__html:html}}/></div>;
  });

  return (
    <div style={S.root}>
      <style>{`
        @keyframes tb{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
        .bgc::-webkit-scrollbar{width:5px}.bgc::-webkit-scrollbar-track{background:transparent}.bgc::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        .bgs:hover{background:${hex2rgba(T.accentSecondary,0.2)}!important;border-color:${T.accentSecondary}!important}
        .bgsend:hover{background:${T.accentHover}!important;transform:scale(1.05)}
        .bgi:focus{border-color:${T.accent}!important;box-shadow:0 0 0 2px ${hex2rgba(T.accent,0.15)}}
      `}</style>

      <div style={S.header}>
        <div style={S.avatar}>BG</div>
        <div style={{flex:1}}>
          <p style={S.name}>Brajesh Gautam</p>
          <p style={S.sub}><span style={S.dot}/> Vedic Astrologer & Consciousness Guide</p>
        </div>
        {["☉","☽","♃","♄"].map((s,i) =>
          <span key={i} style={{fontSize:15, color:[PC.Sun,PC.Moon,PC.Jupiter,PC.Saturn][i], opacity:0.5}}>{s}</span>
        )}
      </div>

      <div style={S.chat} className="bgc">
        {msgs.map((m,i) => (
          <div key={i} style={S.row(m.role==="bot")}>
            {m.role==="bot" && <div style={S.miniAv}>BG</div>}
            <div>
              <div style={S.bubble(m.role==="bot")}>{renderText(m.text)}</div>
              <div style={{...S.ts, textAlign:m.role==="bot"?"left":"right"}}>{m.ts.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
          </div>
        ))}
        {typing && <div style={S.row(true)}>
          <div style={S.miniAv}>BG</div>
          <div style={S.typInd}><div style={S.typDot(0)}/><div style={S.typDot(0.2)}/><div style={S.typDot(0.4)}/></div>
        </div>}
        <div ref={endRef}/>
      </div>

      {showSug && <div style={S.sugArea}>
        {SUGGESTIONS.map((s,i) =>
          <button key={i} className="bgs" style={S.chip} onClick={()=>send(s.q)}>
            <span>{s.icon}</span><span>{s.label}</span>
          </button>
        )}
      </div>}

      <div style={S.inputArea}>
        <textarea ref={inRef} className="bgi" style={S.inp} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Ask Brajesh Gautam anything about Vedic astrology..." rows={1}/>
        <button className="bgsend" style={S.sendBtn} onClick={()=>send(input)} title="Send">➤</button>
      </div>
    </div>
  );
}
