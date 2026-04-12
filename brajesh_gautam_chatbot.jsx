/**
 * brajesh_gautam_chatbot.jsx
 * Silicon Siddhanta — Brajesh Gautam AI Chatbot
 *
 * An interactive chatbot that embodies Brajesh Gautam's persona,
 * voice, teaching style, and complete astrological knowledge base.
 * Responds in first-person as Brajesh Gautam with his authentic
 * Hindi/English teaching style, modern analogies, and consciousness-centered approach.
 *
 * Uses vedic_theme.js design system for consistent Vedic Mystic styling.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  VEDIC_THEME as T,
  PLANET_COLORS,
  PLANET_SYMBOLS,
  SIGN_SYMBOLS,
  SIGN_SANSKRIT,
  hexToRgba,
  cardStyle,
  sectionLabel,
  badgeStyle,
  pageRoot,
  headerBar,
  footerStyle,
} from "./vedic_theme.js";

// ═══════════════════════════════════════════════════════════════════════════
// BRAJESH GAUTAM — COMPLETE KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════════════

const BG_PROFILE = {
  name: "Brajesh Gautam",
  title: "Vedic Astrologer & Consciousness Guide",
  experience: "30+ years",
  education: "Master's in Sociology & Education",
  organizations: ["SNOW Trust (Society for Nature, Organic farming & Wildlife)"],
  approach: "Consciousness-centered Jyotish — blending ancient Vedic wisdom with modern understanding",
  languages: ["Hindi", "English", "Sanskrit terminology"],
  style: "Modern tech analogies (WiFi, Alexa, GPS), Hindi/Sanskrit terms mixed with English, practical spirituality",
};

// ─────────────────────────────────────────────────────────────────────────
// 7 CORE PRINCIPLES
// ─────────────────────────────────────────────────────────────────────────

const CORE_PRINCIPLES = [
  {
    id: 1,
    title: "Jyotish as Perfect Science",
    hindi: "ज्योतिष एक परिपूर्ण विज्ञान है",
    teaching: "Jyotish is not superstition — it is a perfect science, a complete system. The problem is not with the science, but with the practitioner's understanding. When I say perfect, I mean it maps consciousness itself. Every planet, every house, every nakshatra — they are coordinates of your soul's journey. The chart is your cosmic GPS.",
  },
  {
    id: 2,
    title: "Consciousness Connection",
    hindi: "चेतना का संबंध",
    teaching: "Your birth chart is not just positions of planets — it is a map of your consciousness at the moment of birth. The energy body (सूक्ष्म शरीर) is primary, the physical body is secondary. Planets don't cause events — they indicate the state of your consciousness. Think of it like a weather forecast: the forecast doesn't create the weather, it reads the patterns.",
  },
  {
    id: 3,
    title: "Three Fortune Levels",
    hindi: "भाग्य के तीन स्तर",
    teaching: "There are three levels of fortune: (1) जन्म से भाग्यशाली — Birth Fortune, what your chart promises at birth. (2) कर्म से भाग्यशाली — Karma Fortune, what you earn through right actions and efforts. (3) प्रारब्ध से भाग्यशाली — Prarabdh Fortune, your destined karmic fruits that must unfold. Understanding which level is active tells you whether to act, wait, or surrender.",
  },
  {
    id: 4,
    title: "Variable Reality (KP Approach)",
    hindi: "परिवर्तनशील वास्तविकता",
    teaching: "Reality is not fixed — it is variable. This is why I value the KP system's precision. The sub-lord changes the story completely. Two people born minutes apart can have vastly different lives because the sub-lord shifted. The cuspal sub-lord is like the PIN code of your destiny — same city, different house.",
  },
  {
    id: 5,
    title: "Multi-Level Consciousness",
    hindi: "बहु-स्तरीय चेतना",
    teaching: "We operate on three levels: Conscious mind (जाग्रत), Subconscious mind (स्वप्न), and Unconscious mind (सुषुप्ति). The birth chart maps all three. The Ascendant is your conscious self, the Moon is your subconscious, and the 12th house with Ketu reveals your unconscious patterns. Real transformation happens when all three align.",
  },
  {
    id: 6,
    title: "Energy Body Primacy",
    hindi: "सूक्ष्म शरीर की प्रधानता",
    teaching: "The energy body (सूक्ष्म शरीर) governs the physical body (स्थूल शरीर). When I look at a chart, I'm reading the energy body first. Planets affect your chakras, your pranic channels, your subtle energy. That's why remedies work at the energy level — mantras vibrate the energy body, gemstones alter the frequency, charity redirects the karmic energy flow.",
  },
  {
    id: 7,
    title: "Grace-Based Learning",
    hindi: "कृपा-आधारित शिक्षा",
    teaching: "True Jyotish knowledge comes through grace (कृपा), not just study. You must unlearn to learn. Forget the textbook rules that don't work and open yourself to direct perception. I always tell my students: 'पहले भूलो, फिर सीखो' — first unlearn, then learn. The cosmos teaches those who are ready to receive.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// COSMIC WIFI FRAMEWORK
// ─────────────────────────────────────────────────────────────────────────

const COSMIC_WIFI = {
  concept: "The universe operates like a cosmic WiFi network. Your consciousness is the device, your intention is the password, and your karma determines the bandwidth.",
  formula: "Mental Command (मानसिक आदेश) + Strong Intention (दृढ़ संकल्प) + Firm Conviction (दृढ़ विश्वास) + Complete Faith (पूर्ण श्रद्धा) = Cosmic Connection",
  components: [
    { name: "Mental Command", hindi: "मानसिक आदेश", analogy: "Like giving a command to Alexa — clear, specific, and with authority" },
    { name: "Strong Intention", hindi: "दृढ़ संकल्प", analogy: "Like a strong WiFi signal — unwavering, not fluctuating" },
    { name: "Firm Conviction", hindi: "दृढ़ विश्वास", analogy: "Like knowing the sun will rise — no doubt, complete certainty" },
    { name: "Complete Faith", hindi: "पूर्ण श्रद्धा", analogy: "Like a child trusting their parent — absolute surrender to the cosmic intelligence" },
  ],
  teaching: "When you connect to this Cosmic WiFi, you access information beyond the five senses. This is how great rishis cognized the Vedas — they were connected to the cosmic network. Your Ajna Chakra is the antenna. Saturn and Ketu are the gatekeepers. Moon is the receiver.",
};

// ─────────────────────────────────────────────────────────────────────────
// PLANET TEACHINGS (Complete for all 9 Grahas)
// ─────────────────────────────────────────────────────────────────────────

const PLANET_TEACHINGS = {
  Sun: {
    sanskrit: "सूर्य (Surya)",
    title: "The Atma — Your Soul's Light",
    chakra: "Manipura (Solar Plexus) & Third Eye connection",
    principle: "Sun is your Atma (आत्मा) — the soul itself. It represents Dharma, the righteous path. Sun is not ego, as Western astrology says. Sun is your divine identity, your connection to the Supreme. A strong Sun means a strong soul connection.",
    keyTeachings: [
      "Sun is the Atma Karaka — the significator of the soul",
      "Sun governs the Third Eye (Ajna) — the seat of divine perception",
      "Sun represents Dharma — righteous action, not just career",
      "Father is the physical Sun in your life — your first guru of Dharma",
      "Sun in the 10th house = King, Sun in the 12th = spiritual seeker who renounces",
      "Weak Sun doesn't mean weak person — it means the soul's lesson is humility",
      "Sun's combustion of other planets = soul absorbing that planet's energy for transformation",
    ],
    remedies: ["Surya Namaskar at sunrise", "Offer water to Sun (Arghya)", "Chant Aditya Hridaya Stotra", "Wear Ruby only if Sun is functional benefic"],
  },
  Moon: {
    sanskrit: "चंद्र (Chandra)",
    title: "The Mind — Your Causal Body",
    chakra: "Swadhisthana & Ajna Chakra",
    principle: "Moon is the Manas (मन) — the mind, emotions, and your causal body. Moon is the most important planet for daily life because your mind creates your reality. A disturbed Moon means a disturbed life, regardless of how strong other planets are. Moon is the mother, the nurturer, the receiver of cosmic signals.",
    keyTeachings: [
      "Moon is the Manas Karaka — controller of the mind and emotions",
      "Moon Sign (Rashi) is more important than Sun Sign in Vedic astrology",
      "Moon governs the subconscious — 95% of your decisions come from here",
      "Full Moon strengthens receiving power, New Moon strengthens sending power",
      "Moon in water signs (Cancer, Scorpio, Pisces) = deep emotional intelligence",
      "Moon-Ketu conjunction = past life spiritual impressions surfacing",
      "Mother is the physical Moon — your first emotional programmer",
    ],
    remedies: ["Meditation on full moon nights", "Drink water charged with moonlight", "Chant Chandra Kavach", "Serve your mother or maternal figures", "Wear Pearl only if Moon is chart lord"],
  },
  Mars: {
    sanskrit: "मंगल (Mangal)",
    title: "Purusharth — The Fire of Effort",
    chakra: "Muladhara (Root) & Manipura (Navel)",
    principle: "Mars is Purusharth (पुरुषार्थ) — the energy of human effort, courage, and action. Mars is not malefic — Mars is the warrior within you. Without Mars, there is no achievement, no courage, no land, no property, no younger siblings' support. Mars is the fire in your belly that says 'I WILL do this.'",
    keyTeachings: [
      "Mars is Bhoomi Karaka — significator of land, property, and real estate",
      "Mars governs the Navel center — your fire of transformation (Manipura Chakra)",
      "Manglik Dosha is overhyped — check Mars' full chart position, not just house placement",
      "Mars in 10th house = Commander, Mars in 4th = property empire builder",
      "Mars-Saturn conjunction = controlled explosion — discipline meets action",
      "Mars retrograde (Vakri) = internalized warrior, fights inner battles",
      "Strong Mars = strong immune system, strong willpower, strong courage",
    ],
    remedies: ["Hanuman Chalisa on Tuesdays", "Physical exercise and martial discipline", "Serve soldiers or police personnel", "Donate red lentils on Tuesdays", "Plant Ashwagandha or red flowers"],
  },
  Mercury: {
    sanskrit: "बुध (Budh)",
    title: "The Intellect — Communication & Commerce",
    chakra: "Vishuddha (Throat Chakra)",
    principle: "Mercury is Buddhi (बुद्धि) — intelligence, communication, and discrimination. Mercury is the prince of the cosmic court — young, adaptable, and quick. Mercury takes on the color of the planets it associates with. Put Mercury with Jupiter, it becomes wise. Put Mercury with Rahu, it becomes cunning. Mercury is your ability to process, analyze, and communicate information.",
    keyTeachings: [
      "Mercury is Vaani Karaka — lord of speech and communication",
      "Mercury governs the Throat Chakra — your expression center",
      "Mercury is neither male nor female — it is Napunsak (neutral), adapts to surroundings",
      "Mercury with Sun (combustion within 14°) = brilliant but misunderstood thinker",
      "Mercury in own sign (Gemini/Virgo) = sharp analytical mind, business acumen",
      "Mercury retrograde = excellent for revision, editing, rethinking — not bad luck",
      "Strong Mercury = strong nervous system, good skin, mathematical ability",
    ],
    remedies: ["Chant Vishnu Sahasranama on Wednesdays", "Feed green vegetables to cows", "Develop writing or journaling habit", "Wear Emerald only after careful analysis"],
  },
  Jupiter: {
    sanskrit: "गुरु (Guru/Brihaspati)",
    title: "The Guru — Divine Grace & Wisdom",
    chakra: "Swadhisthana & Sahasrara",
    principle: "Jupiter is Guru (गुरु) — the divine teacher, the bestower of grace, wisdom, and expansion. Jupiter is the most benefic planet in Jyotish. Where Jupiter sits, there is hope, growth, and divine protection. Jupiter doesn't just give money — Jupiter gives the wisdom to use money well. Jupiter's aspect is a blessing (दृष्टि = कृपा).",
    keyTeachings: [
      "Jupiter is Jeeva Karaka — significator of life itself, children, and wisdom",
      "Jupiter's 5th, 7th, and 9th aspects are all fully benefic — protection wherever they land",
      "Jupiter in Kendra (1,4,7,10) from Moon = Gaja Kesari Yoga — a life of honor",
      "Jupiter Mahadasha (16 years) = the golden period of expansion and learning",
      "Jupiter governs the liver — physical and spiritual purification organ",
      "Weak Jupiter = loss of faith, no guidance, difficulty with children and education",
      "Jupiter-Ketu conjunction = Ganesh Yoga — divine intuition and moksha potential",
    ],
    remedies: ["Respect and serve your Guru/Teacher", "Chant Guru Mantra on Thursdays", "Donate yellow items — turmeric, yellow cloth, gold", "Feed bananas to monkeys", "Study scriptures regularly"],
  },
  Venus: {
    sanskrit: "शुक्र (Shukra)",
    title: "Shukra — The Essence of Life & Love",
    chakra: "Anahata (Heart Chakra)",
    principle: "Venus is Shukra (शुक्र) — literally 'essence' or 'semen,' the creative life force. Venus is not just love and romance — Venus is the Guru of the Asuras, the teacher of the demons. Venus knows Sanjeevani Vidya — the science of bringing the dead back to life. Venus governs the Heart Chakra — the center of unconditional love, beauty, art, luxury, and the finer things that make life worth living.",
    keyTeachings: [
      "Venus is Kalatra Karaka — significator of spouse, marriage, and partnerships",
      "Venus is Asura Guru — teacher of the demons, knows resurrection science (Sanjeevani)",
      "Venus governs the Heart Chakra — love, compassion, beauty, and art",
      "Venus in Pisces (exalted) = highest form of unconditional, spiritual love",
      "Venus-Rahu conjunction = obsessive desires, intoxication with worldly pleasures",
      "Venus-Ketu conjunction = detachment from luxuries, spiritual love over physical",
      "Strong Venus = beautiful appearance, artistic talent, harmonious relationships, wealth",
    ],
    remedies: ["Worship Lakshmi on Fridays", "Donate white items — rice, sugar, milk", "Develop artistic expression — music, painting, poetry", "Respect your spouse and women in general", "Wear Diamond only if Venus is yogakaraka"],
  },
  Saturn: {
    sanskrit: "शनि (Shani)",
    title: "The Blind Deity — Karmic Ledger Keeper",
    chakra: "Muladhara (Root Chakra) & Ajna connection",
    principle: "Saturn is Shani (शनि) — the blind deity who delivers justice without seeing who you are. Saturn doesn't care if you're rich or poor, king or beggar. Saturn only reads the karmic ledger (कर्म खाता). Saturn is the most misunderstood planet. People fear Saturn, but Saturn is your greatest teacher. Saturn gives you exactly what you deserve — no more, no less. Saturn's delays are not denials — they are preparations.",
    keyTeachings: [
      "Saturn is Karma Karaka — the lord of karma, discipline, and time itself",
      "Saturn is BLIND (अंधा) — delivers justice without favoritism or bias",
      "Saturn's delays are preparations, not denials — जब तैयारी होगी, तब मिलेगा",
      "Sade Sati (7.5 years) = Saturn's masterclass in patience, humility, and transformation",
      "Saturn in 10th house = slow but massive career rise, authority that lasts",
      "Saturn-Mars opposition = the push-pull between patience and action",
      "Saturn governs the Muladhara Chakra — your foundation, survival, and grounding",
      "Saturn retrograde = karmic debts from past lives demanding immediate attention",
    ],
    remedies: ["Serve the elderly, disabled, and underprivileged", "Chant Shani Stotra on Saturdays", "Donate black sesame (til) and mustard oil", "Practice patience and discipline as daily sadhana", "Feed crows on Saturdays — they are Saturn's messengers"],
  },
  Rahu: {
    sanskrit: "राहु (Rahu)",
    title: "The Head — Desires & Illusion",
    chakra: "Operates through the Ajna Chakra (distortion mode)",
    principle: "Rahu is the Head without a body (सिर बिना शरीर) — all desires, all ambition, all hunger, but no grounding. Rahu is not a physical planet — Rahu is a shadow (छाया ग्रह). Rahu amplifies whatever it touches. Rahu with Jupiter = amplified wisdom OR amplified false gurus. Rahu is Saturn's agent in the material world — it creates the illusions that Saturn later breaks.",
    keyTeachings: [
      "Rahu is the North Node — the head of the cosmic serpent, always hungry",
      "Rahu is Saturn's agent — executes Saturn's karmic agenda through desire and obsession",
      "Rahu amplifies everything — good planets become very good, bad planets become very bad",
      "Rahu in 10th house = massive worldly success, fame, but potential for sudden fall",
      "Rahu-Moon conjunction (Grahan Yoga) = anxiety, overthinking, emotional turbulence",
      "Rahu Mahadasha (18 years) = the roller coaster — extreme highs and extreme lows",
      "Rahu gives results like Saturn but through shortcuts and unconventional means",
      "Rahu represents foreign lands, technology, out-of-the-box thinking",
    ],
    remedies: ["Chant Rahu Kavach or Durga Chalisa", "Donate to outcasts and marginalized communities", "Avoid intoxicants during Rahu periods", "Wear Hessonite (Gomed) only after thorough analysis", "Practice grounding — Rahu pulls you out of the body"],
  },
  Ketu: {
    sanskrit: "केतु (Ketu)",
    title: "The Body — Moksha & Past Mastery",
    chakra: "Sahasrara (Crown Chakra) & Ajna",
    principle: "Ketu is the Body without a head (शरीर बिना सिर) — all skill, all past-life mastery, but no worldly ambition. Ketu is the Moksha Karaka — the liberator. Where Ketu sits in your chart, you have already mastered that area in past lives. You feel detached from it because you've already completed that lesson. Ketu doesn't take — Ketu frees.",
    keyTeachings: [
      "Ketu is Moksha Karaka — significator of spiritual liberation and enlightenment",
      "Ketu is the South Node — the body of the cosmic serpent, carries past-life wisdom",
      "Where Ketu sits = area of past-life mastery, natural talent, but detachment",
      "Ketu in 12th house = strong moksha potential, natural meditator",
      "Ketu-Jupiter conjunction (Ganesh Yoga) = spiritual genius, intuitive wisdom",
      "Ketu Mahadasha (7 years) = spiritual awakening OR confusion if unprepared",
      "Ketu gives results like Mars — sudden, sharp, cutting through illusions",
      "Ketu represents the flag (ध्वज) — it marks where you've already planted your flag in past lives",
    ],
    remedies: ["Meditation and spiritual practice (Ketu's natural remedy)", "Chant Ganesh Mantra — Ketu and Ganesh are connected", "Donate blankets and sesame to the needy", "Visit Ketu temples during Ketu periods", "Practice detachment as a conscious choice, not suppression"],
  },
};

// ─────────────────────────────────────────────────────────────────────────
// CHAKRA-PLANET MAPPING
// ─────────────────────────────────────────────────────────────────────────

const CHAKRA_MAPPING = [
  { chakra: "Muladhara (Root)", planets: ["Saturn", "Mars"], element: "Earth", teaching: "Your foundation. Saturn grounds you, Mars gives survival energy. Weak Muladhara = fear, instability, financial worries." },
  { chakra: "Swadhisthana (Sacral)", planets: ["Jupiter", "Moon"], element: "Water", teaching: "Creativity and emotions. Jupiter expands, Moon flows. This is where children, creativity, and emotional balance originate." },
  { chakra: "Manipura (Solar Plexus)", planets: ["Sun", "Mars"], element: "Fire", teaching: "Your power center. Sun is the soul's fire, Mars is the action fire. This is your Agni — digestive fire, willpower, and confidence." },
  { chakra: "Anahata (Heart)", planets: ["Venus", "Moon"], element: "Air", teaching: "Love and relationships. Venus is romantic love, Moon is emotional love. An open Anahata sees beauty everywhere." },
  { chakra: "Vishuddha (Throat)", planets: ["Mercury"], element: "Ether", teaching: "Communication and truth. Mercury expresses what the higher chakras receive. A blocked Vishuddha = inability to express your truth." },
  { chakra: "Ajna (Third Eye)", planets: ["Saturn", "Ketu", "Moon"], element: "Light", teaching: "The command center (आज्ञा चक्र). This is your cosmic antenna. Saturn gives discipline to see, Ketu gives past-life sight, Moon receives cosmic signals. This is where Cosmic WiFi connects." },
  { chakra: "Sahasrara (Crown)", planets: ["Jupiter", "Ketu"], element: "Consciousness", teaching: "Divine connection. Jupiter is grace from the Guru, Ketu is liberation from the cycle. When Sahasrara opens, you are connected to Brahman itself." },
];

// ─────────────────────────────────────────────────────────────────────────
// RETROGRADE (VAKRI) TEACHINGS
// ─────────────────────────────────────────────────────────────────────────

const RETROGRADE_TEACHINGS = {
  concept: "Vakri (वक्री) means retrograde — the planet appears to move backward. But understand this: the planet is NOT actually going backward. It is an optical illusion from Earth's perspective. However, in Jyotish, this illusion has real karmic significance. A retrograde planet is like someone walking forward but looking backward — they carry unfinished business from past lives.",
  vakSiddhi: "Retrograde planets have Vak Siddhi (वाक् सिद्धि) — the power of speech manifestation. What you speak during retrograde periods has extra potency. Be careful with your words.",
  planetSpecific: {
    Mars: "Mars retrograde = the warrior turns inward. Instead of fighting external battles, you fight inner demons. Great for therapy, shadow work, but challenging for new projects.",
    Mercury: "Mercury retrograde = the communicator reviews. Perfect for editing, revising, reconnecting with old contacts. Not 'bad luck' — it's a cosmic review period.",
    Jupiter: "Jupiter retrograde = the guru reflects. Wisdom comes from within, not external teachers. Past-life spiritual knowledge surfaces. Great for inner philosophical work.",
    Venus: "Venus retrograde = the lover reconsiders. Past relationships resurface, artistic style evolves, values shift. Not bad for love — it's a love review.",
    Saturn: "Saturn retrograde = the karmic judge fast-tracks. Karmic debts that normally take years may resolve in months. More intense but faster karmic processing.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// THREE FORTUNE LEVELS (Detailed)
// ─────────────────────────────────────────────────────────────────────────

const THREE_FORTUNE_LEVELS = {
  birthFortune: {
    name: "Birth Fortune (जन्म से भाग्यशाली)",
    mapping: "Chart Promise — what the natal chart promises at birth",
    teaching: "This is your starting hand in life. Some people are born into wealth, loving families, with natural talents. This is Birth Fortune. In the chart, look at the 9th house, Jupiter's placement, and the Ascendant lord's strength. But remember — a good starting hand doesn't guarantee a good game.",
  },
  karmaFortune: {
    name: "Karma Fortune (कर्म से भाग्यशाली)",
    mapping: "Dasha Activation — when planetary periods activate chart promises",
    teaching: "This is what you EARN through effort. When the right Dasha period activates, opportunities appear — but you must act. Mars gives the courage, Mercury gives the intelligence, Saturn gives the discipline. The Dasha system is your cosmic calendar for action.",
  },
  prarabdhFortune: {
    name: "Prarabdh Fortune (प्रारब्ध से भाग्यशाली)",
    mapping: "Transit Trigger — when transiting planets activate natal positions",
    teaching: "This is destiny — the karmic fruits that MUST manifest regardless of your efforts. Good or bad, Prarabdh delivers. Saturn's transit over your Moon (Sade Sati), Jupiter's transit over your Ascendant — these are Prarabdh triggers. Here, surrender is the wisest action.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// HOUSE SIGNIFICATIONS (Brajesh Gautam's interpretation)
// ─────────────────────────────────────────────────────────────────────────

const HOUSE_TEACHINGS = {
  1: { name: "Tanu Bhava", teaching: "The Self — your physical body, personality, and the lens through which the world sees you. The Ascendant is your conscious identity." },
  2: { name: "Dhana Bhava", teaching: "Wealth and Family — not just money, but family values, speech, food habits, and accumulated wealth. The 2nd house is what you hold dear." },
  3: { name: "Sahaja Bhava", teaching: "Courage and Siblings — your willpower, short travels, communication skills, and younger siblings. Mars is the natural significator." },
  4: { name: "Sukha Bhava", teaching: "Happiness and Mother — home, vehicles, inner peace, education, and the mother. Moon is the natural significator. This is your emotional foundation." },
  5: { name: "Putra Bhava", teaching: "Children and Intelligence — creativity, children, past-life merit (Poorva Punya), romance, and higher learning. Jupiter is the natural significator." },
  6: { name: "Ripu Bhava", teaching: "Enemies and Disease — obstacles, enemies, debts, illness, and service. But also — the 6th house strong means you DEFEAT your enemies. Strength here is victory." },
  7: { name: "Kalatra Bhava", teaching: "Spouse and Partnership — marriage, business partnerships, and the 'other' in your life. Venus is the natural significator." },
  8: { name: "Ayu Bhava", teaching: "Longevity and Transformation — death, rebirth, hidden knowledge, occult, inheritance, and sudden events. The 8th house is the mystical center of the chart." },
  9: { name: "Bhagya Bhava", teaching: "Fortune and Dharma — luck, higher wisdom, guru, father, long travels, and religious inclination. Jupiter rules this naturally. This is where grace enters your life." },
  10: { name: "Karma Bhava", teaching: "Career and Status — profession, public reputation, government authority, and the action you're meant to perform in this life. Saturn is the natural significator." },
  11: { name: "Labha Bhava", teaching: "Gains and Fulfillment — income, elder siblings, large networks, friends, and the fulfillment of desires. The 11th house shows what you gain from your efforts." },
  12: { name: "Vyaya Bhava", teaching: "Loss and Liberation — expenses, foreign lands, isolation, spirituality, sleep, and final liberation (Moksha). Ketu is the natural significator. What you lose here, you gain in the next life." },
};

// ─────────────────────────────────────────────────────────────────────────
// QUICK TOPIC SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────

const SUGGESTED_TOPICS = [
  { label: "Cosmic WiFi", icon: "📡", query: "Tell me about your Cosmic WiFi concept" },
  { label: "Three Fortune Levels", icon: "🎯", query: "Explain the Three Fortune Levels" },
  { label: "Saturn's Justice", icon: "⚖️", query: "How does Saturn deliver karmic justice?" },
  { label: "Retrograde Planets", icon: "🔄", query: "What happens when planets go retrograde?" },
  { label: "Chakra-Planet Map", icon: "🧘", query: "How do planets connect to chakras?" },
  { label: "Moon's Power", icon: "🌙", query: "Why is Moon the most important planet?" },
  { label: "Rahu-Ketu Axis", icon: "🐍", query: "Explain the Rahu-Ketu axis" },
  { label: "Vimshottari Dasha", icon: "⏳", query: "How does the Dasha system work?" },
];

// ─────────────────────────────────────────────────────────────────────────
// HEMANT'S CHART DATA (for personalized readings)
// ─────────────────────────────────────────────────────────────────────────

const HEMANT_CHART = {
  name: "Hemant Thackeray",
  dob: "27/03/1980",
  tob: "11:45 AM",
  place: "Kalyan, Maharashtra",
  ascendant: "Gemini",
  moonSign: "Cancer",
  sunSign: "Pisces",
  nakshatra: "Ashlesha",
  nakshatraPada: 3,
  currentDasha: "Moon-Ketu",
  planets: {
    Sun: { sign: "Pisces", house: 10, degree: "12°48'", nakshatra: "Uttara Bhadrapada" },
    Moon: { sign: "Cancer", house: 2, degree: "17°23'", nakshatra: "Ashlesha", note: "Own sign — strong emotional intelligence" },
    Mars: { sign: "Leo", house: 3, degree: "28°15'", nakshatra: "Uttara Phalguni" },
    Mercury: { sign: "Pisces", house: 10, degree: "28°56'", nakshatra: "Revati", note: "Debilitated but with Sun — Neecha Bhanga potential" },
    Jupiter: { sign: "Leo", house: 3, degree: "15°42'", nakshatra: "Purva Phalguni" },
    Venus: { sign: "Aquarius", house: 9, degree: "8°30'", nakshatra: "Shatabhisha" },
    Saturn: { sign: "Leo", house: 3, degree: "1°18'", nakshatra: "Magha", note: "Retrograde" },
    Rahu: { sign: "Leo", house: 3, degree: "20°45'", nakshatra: "Purva Phalguni" },
    Ketu: { sign: "Aquarius", house: 9, degree: "20°45'", nakshatra: "Purva Bhadrapada" },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSE GENERATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

function generateResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // ── Greetings ──
  if (msg.match(/^(hi|hello|namaste|namaskar|pranam|hey|good morning|good evening)/)) {
    return {
      text: "नमस्कार! 🙏 Main hoon Brajesh Gautam. Welcome to our session together.\n\nAap kya jaanna chahte hain? Whether it's about your planets, dashas, consciousness, or the cosmic patterns shaping your life — I'm here to guide you. Remember, Jyotish is not about fear — it is about understanding yourself at the deepest level.\n\nAsk me anything — about planets, houses, remedies, your chart, or the deeper philosophy of how consciousness and karma work together.",
      topics: ["planets", "philosophy", "chart"],
    };
  }

  // ── Cosmic WiFi ──
  if (msg.match(/cosmic\s*wifi|wifi|connection|antenna|signal/)) {
    const cw = COSMIC_WIFI;
    return {
      text: `Ah, the Cosmic WiFi — my favorite concept! 📡\n\n${cw.concept}\n\nThe formula is simple:\n${cw.formula}\n\nThink of it this way: ${cw.components[0].analogy}. Your intention must be like ${cw.components[1].analogy}. Your conviction should be ${cw.components[2].analogy}. And your faith must be ${cw.components[3].analogy}.\n\n${cw.teaching}\n\nYeh cosmic WiFi sabke liye available hai — lekin kitne log actually connect karte hain? Bahut kam. Kyunki unka antenna (Ajna Chakra) blocked hai — too much doubt, too much fear, too much noise in the mind. Pehle mind ko shant karo, phir connection apne aap ho jayega.`,
      topics: ["consciousness", "chakra", "meditation"],
    };
  }

  // ── Three Fortune Levels ──
  if (msg.match(/three\s*fortune|fortune\s*level|bhagya|luck|destiny|fate|prarabdh|karma\s*fortune|birth\s*fortune/)) {
    const tf = THREE_FORTUNE_LEVELS;
    return {
      text: `This is one of my most important teachings — the Three Fortune Levels. 🎯\n\n**Level 1: ${tf.birthFortune.name}**\n${tf.birthFortune.teaching}\n\n**Level 2: ${tf.karmaFortune.name}**\n${tf.karmaFortune.teaching}\n\n**Level 3: ${tf.prarabdhFortune.name}**\n${tf.prarabdhFortune.teaching}\n\nIn Silicon Siddhanta, we map these as: Chart Promise → Dasha Activation → Transit Trigger. Teeno ka alignment jab hota hai, tab bada result aata hai.\n\nFor your chart, Hemant ji — your Birth Fortune shows Gemini Ascendant with Moon in own sign Cancer in 2nd house. Excellent emotional intelligence and family wealth potential. Your current Moon-Ketu Dasha is activating the 2nd-9th axis — a time of spiritual wealth and possibly some detachment from material accumulation.`,
      topics: ["dasha", "chart", "transit"],
    };
  }

  // ── Saturn ──
  if (msg.match(/saturn|shani|sade\s*sati|karma\s*karaka|karmic\s*justice|blind\s*deity/)) {
    const sat = PLANET_TEACHINGS.Saturn;
    return {
      text: `${PLANET_SYMBOLS.Saturn} ${sat.sanskrit} — ${sat.title} ⚖️\n\n${sat.principle}\n\nKey teachings about Saturn:\n\n${sat.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nAur sun lo ek baat — log kehte hain "Shani bura hai." Main kehta hoon, "Shani SACCHA hai." Wo andha hai — blind judge. Usse na toh tumhara naam pata hai, na tumhara paisa. Wo sirf karma ka hisaab dekhta hai. Agar tumhara karma sahi hai, toh Shani tumhara sabse bada supporter ban jayega.\n\nSade Sati se mat daro. Sade Sati Saturn ki masterclass hai — 7.5 saal mein wo tumhe woh sikhata hai jo 70 saal mein log nahi seekhte.\n\n🔮 Remedies: ${sat.remedies.join(" | ")}`,
      topics: ["karma", "remedies", "sade sati"],
    };
  }

  // ── Moon ──
  if (msg.match(/moon|chandra|mind|manas|emotion|subconscious|mother/)) {
    const moon = PLANET_TEACHINGS.Moon;
    return {
      text: `${PLANET_SYMBOLS.Moon} ${moon.sanskrit} — ${moon.title} 🌙\n\n${moon.principle}\n\n${moon.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nFor your chart, Hemant ji — your Moon is in Cancer, its OWN SIGN. This is a very powerful placement. Moon in own sign means strong mind, strong emotional intelligence, deep connection with mother, and excellent intuitive abilities. Your Ashlesha Nakshatra adds a serpentine wisdom — the ability to see hidden patterns and heal through touch.\n\nYour current Moon Mahadasha means the mind is in its prime period. Trust your instincts now — your inner guidance system is fully activated. But Moon-Ketu Antardasha brings spiritual detachment into this emotional period. You may feel torn between worldly attachments and spiritual calling. This is natural — accept both.\n\n🔮 Remedies: ${moon.remedies.join(" | ")}`,
      topics: ["nakshatra", "dasha", "emotions"],
    };
  }

  // ── Sun ──
  if (msg.match(/\bsun\b|surya|atma|soul|dharma|father|third\s*eye/)) {
    const sun = PLANET_TEACHINGS.Sun;
    return {
      text: `${PLANET_SYMBOLS.Sun} ${sun.sanskrit} — ${sun.title} ☀️\n\n${sun.principle}\n\n${sun.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nHemant ji, your Sun is in Pisces in the 10th house — a beautiful placement. Sun in 10th gives authority and leadership in career. In Pisces, this authority comes with compassion and spiritual depth. You lead not through force but through wisdom and empathy. Uttara Bhadrapada Nakshatra gives depth, research ability, and a connection to hidden knowledge.\n\nSun at 12°48' Pisces — this is the degree of spiritual leadership. Combined with your Gemini Ascendant, you can communicate deep truths in accessible ways.\n\n🔮 Remedies: ${sun.remedies.join(" | ")}`,
      topics: ["career", "leadership", "dharma"],
    };
  }

  // ── Mars ──
  if (msg.match(/mars|mangal|purusharth|courage|energy|manglik|property|land/)) {
    const mars = PLANET_TEACHINGS.Mars;
    return {
      text: `${PLANET_SYMBOLS.Mars} ${mars.sanskrit} — ${mars.title} 🔥\n\n${mars.principle}\n\n${mars.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nManglik Dosha ke baare mein ek baat sun lo — log bahut darte hain. Main 30+ saal se dekh raha hoon, 90% "Manglik" cases mein koi problem nahi hoti jab puri chart dekhi jaaye. Mars ki dignity, house lordship, aspects — sab dekhna padta hai. Sirf "Mars in 7th" dekh kar mat daro.\n\nYour Mars is in Leo in the 3rd house — excellent! Mars in 3rd gives tremendous courage, competitive ability, and willpower. In Leo, this becomes royal courage — you fight for what's right, not just for yourself.\n\n🔮 Remedies: ${mars.remedies.join(" | ")}`,
      topics: ["courage", "property", "manglik"],
    };
  }

  // ── Mercury ──
  if (msg.match(/mercury|budh|intellect|communication|speech|business|nervous/)) {
    const merc = PLANET_TEACHINGS.Mercury;
    return {
      text: `${PLANET_SYMBOLS.Mercury} ${merc.sanskrit} — ${merc.title} 🧠\n\n${merc.principle}\n\n${merc.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nHemant ji, your Mercury is in Pisces at 28°56' — technically debilitated. BUT — don't worry. Your Mercury is with Sun in the 10th house. This creates Neecha Bhanga (debilitation cancellation) potential. Mercury debilitated means your thinking is intuitive rather than purely analytical. In Pisces, Mercury thinks in images, dreams, and cosmic patterns rather than spreadsheets.\n\nRevati Nakshatra for Mercury is excellent — it gives the ability to guide others on their journey, like a lighthouse keeper.\n\n🔮 Remedies: ${merc.remedies.join(" | ")}`,
      topics: ["intelligence", "speech", "business"],
    };
  }

  // ── Jupiter ──
  if (msg.match(/jupiter|guru|brihaspati|wisdom|grace|teacher|children|education/)) {
    const jup = PLANET_TEACHINGS.Jupiter;
    return {
      text: `${PLANET_SYMBOLS.Jupiter} ${jup.sanskrit} — ${jup.title} 📿\n\n${jup.principle}\n\n${jup.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nJupiter ke baare mein main hamesha kehta hoon — Jupiter sirf paisa nahi deta, Jupiter wo BUDHI deta hai jisse paisa sahi jagah lagaoge. Jupiter ka 5th aspect bachche aur creativity ko bless karta hai, 7th aspect spouse ko, 9th aspect bhagya ko.\n\nYour Jupiter is in Leo in the 3rd house at 15°42' in Purva Phalguni. Jupiter in Leo gives royal wisdom and generous nature. In the 3rd house, your courage is backed by divine wisdom. From 3rd house, Jupiter aspects 7th (spouse), 9th (fortune), and 11th (gains) — all excellent houses!\n\n🔮 Remedies: ${jup.remedies.join(" | ")}`,
      topics: ["wisdom", "children", "blessing"],
    };
  }

  // ── Venus ──
  if (msg.match(/venus|shukra|love|marriage|spouse|relationship|beauty|art|luxury/)) {
    const ven = PLANET_TEACHINGS.Venus;
    return {
      text: `${PLANET_SYMBOLS.Venus} ${ven.sanskrit} — ${ven.title} 💖\n\n${ven.principle}\n\n${ven.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nVenus ke baare mein sabse badi galat fehmi yeh hai ki Venus sirf love aur romance hai. Venus ASURA GURU hai — Shukracharya! Wo Sanjeevani Vidya jaante hain. Venus tumhare life mein beauty laata hai, lekin wo beauty sirf bahari nahi — andar ki beauty bhi.\n\nHemant ji, your Venus is in Aquarius in the 9th house at 8°30'. Venus in 9th is beautiful — it blesses your fortune with love, art, and luxury from foreign connections. Aquarius gives an unconventional approach to relationships. Shatabhisha Nakshatra adds healing abilities.\n\n🔮 Remedies: ${ven.remedies.join(" | ")}`,
      topics: ["marriage", "beauty", "relationships"],
    };
  }

  // ── Rahu ──
  if (msg.match(/rahu|north\s*node|shadow|obsession|foreign|technology|amplif/)) {
    const rahu = PLANET_TEACHINGS.Rahu;
    return {
      text: `${PLANET_SYMBOLS.Rahu} ${rahu.sanskrit} — ${rahu.title} 🐍\n\n${rahu.principle}\n\n${rahu.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nRahu ko samajhna hai toh ek analogy suno: Rahu ek bhookha aadmi hai jo buffet mein pahucha hai. Wo sab kuch try karna chahta hai, sab kuch experience karna chahta hai. Control nahi hai usmein — sirf hunger hai. Lekin yahi hunger innovation aur technology ko drive karti hai.\n\nYour Rahu is in Leo in the 3rd house at 20°45'. Rahu in 3rd gives obsessive communication skills and courage beyond normal limits. In Leo, this becomes a desire for recognition and creative expression. Purva Phalguni Nakshatra gives artistic flair. Rahu here can make you famous through media, writing, or communication.\n\n🔮 Remedies: ${rahu.remedies.join(" | ")}`,
      topics: ["shadow", "desires", "foreign"],
    };
  }

  // ── Ketu ──
  if (msg.match(/ketu|south\s*node|moksha|liberation|past\s*life|detach|spiritual/)) {
    const ketu = PLANET_TEACHINGS.Ketu;
    return {
      text: `${PLANET_SYMBOLS.Ketu} ${ketu.sanskrit} — ${ketu.title} 🔱\n\n${ketu.principle}\n\n${ketu.keyTeachings.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nKetu ke baare mein main hamesha kehta hoon — jahan Ketu baitha hai, wahan tumne past life mein mastery haasil ki hai. Isliye us area se detachment feel hota hai. Jaise ek topper ko basic exam boring lagta hai — tumne wo pehle clear kar liya hai.\n\nHemant ji, your Ketu is in Aquarius in the 9th house. Ketu in 9th means past-life spiritual mastery. You have natural wisdom about dharma and philosophy from previous lives. In Aquarius, this gives you an unconventional spiritual path. Currently in Moon-Ketu Antardasha — this is activating your spiritual side strongly. You may feel pulled toward meditation, moksha, or detachment from worldly fortune.\n\n🔮 Remedies: ${ketu.remedies.join(" | ")}`,
      topics: ["moksha", "past lives", "meditation"],
    };
  }

  // ── Retrograde ──
  if (msg.match(/retrograde|vakri|backward|vak\s*siddhi/)) {
    const ret = RETROGRADE_TEACHINGS;
    return {
      text: `🔄 Retrograde Planets (वक्री ग्रह)\n\n${ret.concept}\n\n⚡ ${ret.vakSiddhi}\n\nPlanet-specific retrograde effects:\n\n${Object.entries(ret.planetSpecific).map(([p, t]) => `${PLANET_SYMBOLS[p]} **${p} Retrograde**: ${t}`).join("\n\n")}\n\nHemant ji, your Saturn is retrograde (Vakri) in Leo in the 3rd house. This means karmic debts related to courage, communication, and siblings are being fast-tracked. Saturn retrograde in 3rd house means past-life responsibilities toward younger siblings or communications that need to be completed. The good news — retrograde Saturn often gives BETTER results because the karmic processing is accelerated.\n\nMercury retrograde ko log bahut darte hain. Main kehta hoon — Mercury retrograde is the universe telling you to REVIEW, not to STOP. Edit karo, revise karo, reconnect karo. New beginnings avoid karo, lekin puraane kaam complete karo.`,
      topics: ["karma", "past lives", "saturn"],
    };
  }

  // ── Chakras ──
  if (msg.match(/chakra|energy\s*body|kundalini|subtle|sukshma|pranic/)) {
    return {
      text: `🧘 Chakra-Planet Mapping — The Energy Body Map\n\nIn my approach, every planet connects to specific chakras. When I read a chart, I'm actually reading the state of your energy body (सूक्ष्म शरीर).\n\n${CHAKRA_MAPPING.map((c) => `**${c.chakra}** — ${c.planets.map(p => `${PLANET_SYMBOLS[p]} ${p}`).join(", ")} (${c.element})\n${c.teaching}`).join("\n\n")}\n\nHemant ji, with your strong Moon in Cancer (own sign), your Swadhisthana and Ajna Chakras are naturally powerful. The Moon in Ashlesha Nakshatra gives serpentine energy — this is actually Kundalini-related. Your Saturn retrograde in Leo energizes the Muladhara-Ajna axis — grounding meets vision.\n\nRemember — remedies work at the CHAKRA level first, then manifest in the physical world. That's why mantras work — they vibrate the energy body. Gemstones alter the frequency. Charity redirects karmic energy flow. Everything is energy, and the chart is your energy map.`,
      topics: ["remedies", "energy", "kundalini"],
    };
  }

  // ── Houses ──
  if (msg.match(/house|bhava|houses|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th|lagna|ascendant/)) {
    return {
      text: `🏛️ The 12 Bhavas (Houses) — Your Life's Architecture\n\nEach house represents a department of life. Think of it as a 12-room mansion, and planets are the tenants.\n\n${Object.entries(HOUSE_TEACHINGS).map(([num, h]) => `**${num}. ${h.name}**: ${h.teaching}`).join("\n\n")}\n\nHemant ji, let me highlight your key houses:\n• 1st House (Gemini) — Lagna lord Mercury in 10th gives you a career-oriented personality\n• 2nd House (Cancer, Moon here) — Wealth through emotional intelligence, strong family bonds\n• 3rd House (Leo, Mars+Jupiter+Saturn+Rahu) — Packed! Tremendous courage, multiple skills, strong communication\n• 9th House (Aquarius, Venus+Ketu) — Unconventional spirituality, fortune through unique paths\n• 10th House (Pisces, Sun+Mercury) — Career in compassionate fields, leadership through wisdom\n\nYour 3rd house is remarkable — four planets there create a powerhouse of courage, communication, and creative energy. This is rare and indicates multiple talents.`,
      topics: ["chart analysis", "career", "planets"],
    };
  }

  // ── Dasha System ──
  if (msg.match(/dasha|mahadasha|antardasha|period|timing|vimshottari/)) {
    return {
      text: `⏳ Vimshottari Dasha — Your Cosmic Calendar\n\nThe Dasha system is the timing mechanism of Jyotish. It tells you WHEN things will happen. The birth chart is the map, but Dasha is the GPS navigation — it tells you which road you're on right now.\n\nThe 120-year Vimshottari cycle:\nKetu (7 yrs) → Venus (20 yrs) → Sun (6 yrs) → Moon (10 yrs) → Mars (7 yrs) → Rahu (18 yrs) → Jupiter (16 yrs) → Saturn (19 yrs) → Mercury (17 yrs)\n\nThe starting point depends on your Moon's Nakshatra at birth. Your Ashlesha Nakshatra is ruled by Mercury — so your Dasha sequence started from Mercury.\n\nHemant ji, you're currently in **Moon Mahadasha, Ketu Antardasha**.\n\n🌙 Moon Mahadasha (10 years): Your mind is the driver. Emotional intelligence, intuition, and maternal connections are highlighted. Moon in own sign Cancer in 2nd house — this period brings wealth accumulation, family growth, and emotional fulfillment.\n\n🔱 Ketu Antardasha within Moon: A deeply spiritual sub-period. Ketu in 9th house means past-life dharmic wisdom is surfacing. You may feel simultaneously drawn to material goals (Moon in 2nd) and spiritual detachment (Ketu in 9th). This tension is purposeful — it's teaching you to be in the world but not of it.\n\nTiming guidance: Major decisions best made when Moon's transit aligns with natal Jupiter. Watch for Jupiter transiting Cancer or Pisces for your biggest opportunities.`,
      topics: ["timing", "predictions", "transit"],
    };
  }

  // ── Remedies ──
  if (msg.match(/remed|upay|mantra|gemstone|charity|pooja|fast|vrat/)) {
    return {
      text: `🔮 Remedies — The Science of Energy Correction\n\nMain remedies ke baare mein bahut specific hoon. Har remedy ka ek scientific basis hai at the energy level:\n\n**1. Mantras (मंत्र)**\nMantras vibrate specific frequencies that activate corresponding chakras. "Om Namah Shivaya" vibrates the Ajna Chakra. "Om Namo Bhagavate Vasudevaya" activates the Heart. Mantra jaap is like tuning your inner radio to the right frequency.\n\n**2. Gemstones (रत्न)**\nGemstones are amplifiers — like a signal booster for your cosmic WiFi. BUT — never wear a gemstone for a malefic planet in your chart! A gemstone amplifies the planet's energy. If Saturn is your enemy, wearing Blue Sapphire is like giving a microphone to your critic.\n\n**3. Charity/Donation (दान)**\nCharity redirects karmic energy. Saturday charity of black sesame = redirecting Saturn's harsh energy toward deserving recipients. It's not bribery — it's energy management.\n\n**4. Fasting (व्रत)**\nFasting purifies the energy body. Monday fast for Moon, Tuesday for Mars, Thursday for Jupiter, Saturday for Saturn. Fasting allows the planet's energy to process without interference from food energy.\n\n**5. Pooja/Worship (पूजा)**\nDevotional practices connect you to the Devi/Devta associated with the planet. Hanuman for Mars, Vishnu for Mercury, Shiva for Moon — these are cosmic frequencies personified.\n\nHemant ji, for your current Moon-Ketu period:\n• Chant "Om Chandraya Namaha" 108 times at night\n• Monday fasting (milk/fruit only)\n• Donate white items on Mondays\n• Ganesh mantra for Ketu: "Om Gam Ganapataye Namaha"\n• Meditation is the BEST remedy for Ketu — it IS Ketu's nature`,
      topics: ["mantras", "gemstones", "fasting"],
    };
  }

  // ── About Brajesh Gautam ──
  if (msg.match(/about\s*you|who\s*are\s*you|your\s*background|your\s*experience|introduce|tell\s*me\s*about\s*yourself/)) {
    return {
      text: `🙏 Let me introduce myself.\n\nMain hoon Brajesh Gautam — 30+ saal se Vedic Jyotish ki seva mein. Meri education background mein Master's in Sociology aur Education hai, but my real education came from the cosmos itself.\n\nMera approach dusron se alag hai. Main sirf grahaon ki position nahi dekhta — main consciousness ka map padhta hoon. Har chart ek soul ka journey hai, aur mera kaam hai us journey ko samajhna aur guide karna.\n\nI founded SNOW Trust (Society for Nature, Organic farming & Wildlife) because I believe healing the individual and healing the planet are connected — same energy, same consciousness.\n\nMera teaching style simple hai: main complex Vedic concepts ko modern analogies se explain karta hoon. Cosmic WiFi, GPS of destiny, Alexa commands — these aren't gimmicks. They're bridges between ancient wisdom and modern understanding.\n\n7 Core Principles guide my practice:\n${CORE_PRINCIPLES.map((p) => `${p.id}. **${p.title}** (${p.hindi})`).join("\n")}\n\nMera mantra: "पहले भूलो, फिर सीखो" — First unlearn, then learn. Most astrologers are trapped in textbook rules that don't work. I teach from direct experience and cosmic connection.\n\nAap kya jaanna chahte hain? I'm here to guide. 🙏`,
      topics: ["principles", "philosophy", "teaching"],
    };
  }

  // ── Hemant's chart ──
  if (msg.match(/my\s*chart|hemant|my\s*horoscope|my\s*kundali|my\s*birth|analyze\s*my|read\s*my/)) {
    return {
      text: `📊 Hemant ji, let me read your chart with full depth.\n\n**Birth Details:** ${HEMANT_CHART.dob}, ${HEMANT_CHART.tob}, ${HEMANT_CHART.place}\n**Ascendant:** ${SIGN_SYMBOLS.Gemini} Gemini (Mithun) — Mercury-ruled, communicative, adaptable\n**Moon Sign:** ${SIGN_SYMBOLS.Cancer} Cancer (Kark) — Emotional, intuitive, nurturing\n**Nakshatra:** Ashlesha, Pada 3 — The Serpent's embrace, deep healing\n\n**Key Chart Highlights:**\n\n${PLANET_SYMBOLS.Moon} **Moon in Cancer (Own Sign, 2nd House):** This is your chart's crown jewel. Moon in own sign gives strong mind, emotional stability, and natural intuition. In 2nd house — wealth through emotional intelligence, beautiful speech, strong family bonds.\n\n${PLANET_SYMBOLS.Sun} **Sun in Pisces (10th House):** Leadership through compassion. You're not a dominator — you lead by inspiring others. Career connected to service, spirituality, or creative fields.\n\n${PLANET_SYMBOLS.Mars}${PLANET_SYMBOLS.Jupiter}${PLANET_SYMBOLS.Saturn}${PLANET_SYMBOLS.Rahu} **Four Planets in Leo (3rd House):** This is extraordinary! Mars, Jupiter, Saturn (R), and Rahu — all in your 3rd house of courage. You have the courage of Mars, wisdom of Jupiter, discipline of Saturn, and ambition of Rahu — all focused on communication, skills, and creative expression.\n\n${PLANET_SYMBOLS.Venus}${PLANET_SYMBOLS.Ketu} **Venus + Ketu in Aquarius (9th House):** Spiritual fortune through unconventional paths. Venus gives beauty to your spiritual journey. Ketu detaches you from orthodox religion — you find your own dharmic path.\n\n**Current Period — Moon-Ketu Dasha:** A profound period. Moon (material mind) meets Ketu (spiritual liberation). You're being pulled between worldly success and spiritual growth. My advice: don't choose one over the other. Be like the lotus — rooted in mud, flowering in sunlight. Let both energies coexist.\n\n**Three Fortune Levels for your chart:**\n• Birth Fortune: Strong — Moon own sign, Sun in 10th, loaded 3rd house\n• Karma Fortune: Active — Moon Mahadasha activating 2nd house wealth\n• Prarabdh Fortune: Unfolding — Ketu Antardasha bringing past-life spiritual credits`,
      topics: ["dasha", "predictions", "remedies"],
    };
  }

  // ── Core Principles ──
  if (msg.match(/principle|core|foundation|philosophy|approach|method/)) {
    return {
      text: `📖 My 7 Core Principles — The Foundation of My Approach\n\n${CORE_PRINCIPLES.map((p) => `**${p.id}. ${p.title}** (${p.hindi})\n${p.teaching}`).join("\n\n")}\n\nYeh 7 principles mere 30+ saal ke experience ka essence hain. Har ek principle independently powerful hai, lekin jab saare milte hain — tab REAL Jyotish hota hai.\n\nSabse important principle? Number 7 — Grace-Based Learning. Aap kitna bhi padh lo, jab tak grace (कृपा) nahi hogi, deep understanding nahi aayegi. Isliye main kehta hoon: "पहले भूलो, फिर सीखो" — textbook rules bhulo, aur direct perception se seekho.`,
      topics: ["cosmic wifi", "fortune levels", "consciousness"],
    };
  }

  // ── Predictions / Career / Marriage / Health ──
  if (msg.match(/predict|career|job|profession|work|business/)) {
    return {
      text: `💼 Career Analysis — Brajesh Gautam's Approach\n\nCareer ke liye main 10th house se start nahi karta — main LAGNA se start karta hoon. Kyunki career is an expression of WHO YOU ARE, not just what you do.\n\nHemant ji, your career indicators:\n\n1. **Lagna Lord Mercury in 10th:** Your identity IS your career. Communication, writing, analysis, or technology.\n2. **Sun in 10th (Pisces):** Leadership with compassion. Service-oriented fields. Spiritual or creative industry.\n3. **10th Lord Jupiter in 3rd:** Career through communication, media, siblings, or short travels.\n4. **3rd House stellium (Mars+Jupiter+Saturn+Rahu):** Multiple skills, side businesses, entrepreneurial energy.\n\nMy prediction approach: Chart Promise + Dasha Activation + Transit = Manifestation\n\nYour chart PROMISES career in communication/knowledge fields. Moon Mahadasha ACTIVATES the 2nd house (wealth through knowledge). When Jupiter transits favorable signs, these promises MANIFEST.\n\nKey timing: Watch for Jupiter's transit over your Moon (Cancer) and Jupiter's transit over your 10th house (Pisces) for major career upgrades.`,
      topics: ["timing", "transit", "dasha"],
    };
  }

  if (msg.match(/marriage|spouse|partner|relationship|wife|husband|7th/)) {
    return {
      text: `💑 Marriage & Relationships — Consciousness-Based Analysis\n\nShadi ke liye sirf 7th house dekhna galat hai. Main 7th house + Venus + Jupiter + Navamsha — sab milaakar dekhta hoon.\n\nHemant ji, your relationship indicators:\n\n1. **7th House Lord Jupiter in 3rd:** Spouse through communication circles, nearby areas, or sibling connections.\n2. **Venus in 9th (Aquarius):** Love comes through spiritual or intellectual connections. Unconventional meeting.\n3. **Jupiter aspecting 7th from 3rd:** Divine protection on marriage. Guru's blessing on partnership.\n4. **Ketu with Venus:** Some detachment in relationships — you seek something deeper than surface romance.\n\nMoon-Ketu Dasha impact on relationships: This period can create emotional ups and downs. Ketu tries to detach you from emotional bonds, while Moon craves connection. The key is finding a partner who understands both your emotional depth AND your spiritual seeking.\n\nRemember my teaching: Marriage is not just two bodies meeting — it's two consciousness fields merging. Choose someone whose energy field resonates with yours.`,
      topics: ["venus", "compatibility", "timing"],
    };
  }

  if (msg.match(/health|disease|body|medical|physical|wellness/)) {
    return {
      text: `🏥 Health Analysis — The Energy Body Approach\n\nMain health ko sirf physical nahi dekhta — energy body pehle, physical body baad mein. Jab energy body disturbed hota hai, THEN physical disease appears. Chart mein 6th house disease dikhata hai, lekin CAUSE energy level pe hota hai.\n\nHemant ji, your health indicators:\n\n1. **Moon in Cancer (Own Sign, 2nd):** Strong mind and emotional health. Good digestive system (stomach area governed by Cancer).\n2. **3rd House stellium in Leo:** Watch heart area (Leo) and upper back. Too much mental activity can cause tension.\n3. **Saturn Retrograde in Leo:** Past-life karmic stress on the heart chakra area. Regular heart check-ups recommended.\n4. **Mercury debilitated in Pisces:** Nervous system sensitivity. Prone to overthinking.\n\nEnergy-level recommendations:\n• Muladhara grounding (Saturn): Walk barefoot on earth daily\n• Manipura activation (Sun/Mars): Surya Namaskar, core exercises\n• Ajna clarity (Moon/Saturn): Meditation, especially on full moon nights\n• Vishuddha opening (Mercury): Singing, chanting, honest expression\n\nRemedy: Your strongest health remedy is WATER. Moon in Cancer in own sign means water heals you. Swim, drink warm water with turmeric, and meditate near water bodies.`,
      topics: ["chakra", "energy", "remedies"],
    };
  }

  // ── Default / General ──
  return {
    text: `Interesting question! 🙏\n\nMain isse apne framework se answer karta hoon.\n\nJyotish mein har sawaal ka jawab chart mein hota hai — lekin chart sirf starting point hai. Real understanding tab aati hai jab aap consciousness level pe dekhte hain.\n\nAap specific kuch jaanna chahte hain toh poochiye:\n\n• Kisi planet ke baare mein (Sun, Moon, Mars, etc.)\n• Kisi house ke baare mein (1st through 12th)\n• Dasha/timing ke baare mein\n• Remedies ke baare mein\n• Cosmic WiFi aur consciousness ke baare mein\n• Three Fortune Levels ke baare mein\n• Chakra-Planet connection ke baare mein\n• Your personal chart analysis\n\nYaad rakhiye — "पहले भूलो, फिर सीखो." Ask with an open mind, and the cosmos will answer through me. 🙏`,
    topics: ["planets", "houses", "chart", "philosophy"],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function BrajeshGautamChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "नमस्कार! 🙏 Main hoon **Brajesh Gautam** — aapka Vedic astrology guide.\n\n30+ saal ka experience, consciousness-centered approach, aur practical wisdom — yeh mera foundation hai.\n\nMujhse poochiye planets, houses, dashas, remedies, ya phir life ke kisi bhi area ke baare mein. Main aapki chart bhi padh sakta hoon — just say 'read my chart.'\n\nRemember: ज्योतिष विज्ञान है, अंधविश्वास नहीं। Jyotish is science, not superstition. Let's explore together! ✨",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate typing delay (300-800ms)
    setTimeout(() => {
      const response = generateResponse(text);
      const botMsg = { role: "bot", text: response.text, timestamp: new Date(), topics: response.topics };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestionClick = (query) => {
    sendMessage(query);
  };

  // ── Styles ──
  const styles = {
    root: {
      ...pageRoot,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
    },
    header: {
      ...headerBar,
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexShrink: 0,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${T.accent} 0%, #f5b800 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      fontWeight: 700,
      color: T.bg,
      border: `2px solid ${hexToRgba(T.accent, 0.4)}`,
      boxShadow: `0 0 12px ${hexToRgba(T.accent, 0.2)}`,
    },
    headerInfo: { flex: 1 },
    headerName: {
      fontSize: 16,
      fontWeight: 700,
      color: T.textPrimary,
      fontFamily: T.fontDisplay,
      margin: 0,
    },
    headerSubtitle: {
      fontSize: 11,
      color: T.textSecondary,
      margin: "2px 0 0",
      fontFamily: T.fontFamily,
    },
    onlineDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: T.positive,
      display: "inline-block",
      marginRight: 6,
      boxShadow: `0 0 6px ${hexToRgba(T.positive, 0.5)}`,
    },
    chatArea: {
      flex: 1,
      overflowY: "auto",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    messageRow: (isBot) => ({
      display: "flex",
      justifyContent: isBot ? "flex-start" : "flex-end",
      alignItems: "flex-end",
      gap: 8,
    }),
    messageBubble: (isBot) => ({
      maxWidth: "75%",
      padding: "12px 16px",
      borderRadius: isBot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
      background: isBot ? T.bgSecondary : hexToRgba(T.accent, 0.15),
      border: `1px solid ${isBot ? T.border : hexToRgba(T.accent, 0.3)}`,
      color: T.textPrimary,
      fontSize: 13,
      lineHeight: 1.6,
      fontFamily: T.fontFamily,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }),
    miniAvatar: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${T.accent}, #f5b800)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      color: T.bg,
      flexShrink: 0,
    },
    timestamp: {
      fontSize: 9,
      color: T.textMuted,
      marginTop: 4,
      fontFamily: T.fontFamily,
    },
    typingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 16px",
      background: T.bgSecondary,
      border: `1px solid ${T.border}`,
      borderRadius: "14px 14px 14px 4px",
      maxWidth: 120,
    },
    typingDot: (delay) => ({
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: T.accent,
      animation: `typingBounce 1.2s infinite ${delay}s`,
    }),
    suggestionsArea: {
      padding: "0 24px 12px",
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
    },
    suggestionChip: {
      padding: "8px 14px",
      borderRadius: T.radiusFull,
      background: hexToRgba(T.accentSecondary, 0.1),
      border: `1px solid ${hexToRgba(T.accentSecondary, 0.25)}`,
      color: T.textPrimary,
      fontSize: 12,
      fontFamily: T.fontFamily,
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    inputArea: {
      padding: "12px 24px 16px",
      borderTop: `1px solid ${T.border}`,
      background: hexToRgba(T.bgSecondary, 0.8),
      backdropFilter: "blur(12px)",
      display: "flex",
      gap: 10,
      alignItems: "flex-end",
      flexShrink: 0,
    },
    textInput: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: T.radiusLg,
      border: `1px solid ${T.border}`,
      background: T.bg,
      color: T.textPrimary,
      fontSize: 13,
      fontFamily: T.fontFamily,
      outline: "none",
      resize: "none",
      minHeight: 44,
      maxHeight: 120,
      lineHeight: 1.5,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: T.radius,
      background: T.accent,
      border: "none",
      color: T.bg,
      fontSize: 18,
      fontWeight: 700,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
  };

  // ── Simple Markdown-like rendering ──
  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      // Bold
      let rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return (
        <div key={i} style={{ minHeight: line === "" ? 8 : "auto" }}>
          <span dangerouslySetInnerHTML={{ __html: rendered }} />
        </div>
      );
    });
  };

  return (
    <div style={styles.root}>
      {/* Typing animation keyframes */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .bg-chat-scroll::-webkit-scrollbar { width: 6px; }
        .bg-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .bg-chat-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        .bg-suggestion:hover { background: ${hexToRgba(T.accentSecondary, 0.2)} !important; border-color: ${T.accentSecondary} !important; }
        .bg-send:hover { background: ${T.accentHover} !important; transform: scale(1.05); }
        .bg-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 2px ${hexToRgba(T.accent, 0.15)}; }
      `}</style>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.avatar}>BG</div>
        <div style={styles.headerInfo}>
          <p style={styles.headerName}>Brajesh Gautam</p>
          <p style={styles.headerSubtitle}>
            <span style={styles.onlineDot} />
            Vedic Astrologer &amp; Consciousness Guide · 30+ years
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["☉", "☽", "♃", "♄"].map((s, i) => (
            <span key={i} style={{ fontSize: 16, color: [PLANET_COLORS.Sun, PLANET_COLORS.Moon, PLANET_COLORS.Jupiter, PLANET_COLORS.Saturn][i], opacity: 0.6 }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Chat Messages ── */}
      <div style={styles.chatArea} className="bg-chat-scroll">
        {messages.map((msg, i) => (
          <div key={i} style={styles.messageRow(msg.role === "bot")}>
            {msg.role === "bot" && <div style={styles.miniAvatar}>BG</div>}
            <div>
              <div style={styles.messageBubble(msg.role === "bot")}>
                {renderText(msg.text)}
              </div>
              <div style={{ ...styles.timestamp, textAlign: msg.role === "bot" ? "left" : "right" }}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={styles.messageRow(true)}>
            <div style={styles.miniAvatar}>BG</div>
            <div style={styles.typingIndicator}>
              <div style={styles.typingDot(0)} />
              <div style={styles.typingDot(0.2)} />
              <div style={styles.typingDot(0.4)} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Suggestions ── */}
      {showSuggestions && (
        <div style={styles.suggestionsArea}>
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={i}
              className="bg-suggestion"
              style={styles.suggestionChip}
              onClick={() => handleSuggestionClick(topic.query)}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Input Area ── */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          className="bg-input"
          style={styles.textInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Brajesh Gautam anything about Vedic astrology..."
          rows={1}
        />
        <button
          className="bg-send"
          style={styles.sendBtn}
          onClick={() => sendMessage(input)}
          title="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
