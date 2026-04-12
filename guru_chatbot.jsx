/**
 * guru_chatbot.jsx
 * ═══════════════════════════════════════════════════════════════════════
 * Silicon Siddhanta — 4-in-1 Guru AI Chatbot (Floating Element)
 * VERSION 2: Full AI Intelligence Engine
 *
 * Architecture:
 *   Intent Detection → Entity Extraction → Context Memory → Graph Search → Persona Composer
 *
 * Personas:
 *   1. Brajesh Gautam  — KP Jyotish, Consciousness, Cosmic WiFi
 *   2. Sadhguru         — Inner Engineering, Isha Yoga, Practical Wisdom
 *   3. Sri Sri          — Art of Living, Sudarshan Kriya, Breath-Mind
 *   4. Siddha           — 18 Siddhars, Kayakalpa, Vasi Yoga, Alchemy
 *
 * Floating Pattern: Mini orb → Guru selector → Chat panel
 * Boltable: ZenFlo + Airjun via props API
 *
 * Usage:
 *   <GuruChatbot />
 *   <GuruChatbot theme={{ bg: "#fff", text: "#111" }} />
 *   <GuruChatbot startGuru="sadhguru" compact={true} />
 *   <GuruChatbot position="bottom-left" />
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const DEFAULT_THEME = {
  bg:"#0b1120",bgSec:"#131b2e",bgTer:"#1a2340",bgCard:"rgba(19,27,46,0.85)",
  text:"#eef2f7",textSec:"#8b9cc0",textMuted:"#5a6b8a",accent:"#e5a100",
  accentHov:"#f5b800",indigo:"#6366f1",cyan:"#0ea5e9",pos:"#22c55e",
  neg:"#ef4444",warn:"#eab308",border:"#1e2a42",borderAcc:"rgba(229,161,0,0.25)",
  radius:"14px",font:"'Inter','Segoe UI',system-ui,sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════
// AI ENGINE: Intent Detection + Entity Extraction
// ═══════════════════════════════════════════════════════════════════════

const INTENT_RULES = [
  {intent:"GREETING",patterns:[/^(hi|hello|namaste|namaskar|pranam|hey|good\s*(morning|evening)|vanakkam|jai\s*guru)/i]},
  {intent:"META",patterns:[/who\s*are\s*you|about\s*you|introduce|what\s*can\s*you/i]},
  {intent:"PRACTICE",patterns:[/how\s*(do|can|should|to)\s*(i|we)|step|practice|technique|exercise|routine|daily|start|begin|guide\s*me|teach\s*me|what\s*should\s*i\s*do/i]},
  {intent:"PERSONAL",patterns:[/\b(my|i'm|i am|i have|i feel|my chart|my life|my career|my marriage|my health|for me|in my case|about me)\b/i]},
  {intent:"REMEDY",patterns:[/remed|cure|heal|fix|solve|help\s*with|mantra\s*for|gemstone|how\s*to\s*(overcome|deal|handle|reduce|remove|stop)/i]},
  {intent:"COMFORT",patterns:[/worried|scared|anxious|depressed|sad|lonely|confused|lost|helpless|suffering|pain|struggle|difficult|hard time|overwhelmed/i]},
  {intent:"COMPARE",patterns:[/vs|versus|difference|compare|better|which\s*(is|one)|between/i]},
  {intent:"DEBATE",patterns:[/but\s*(what|how|why)|really\?|prove|scientific|superstit|doesn't\s*make/i]},
  {intent:"STORY",patterns:[/story|example|analogy|metaphor|explain\s*like|tell\s*me\s*a/i]},
  {intent:"LEARN",patterns:[/what\s*(is|are|does)|explain|meaning|significance|why|tell\s*me\s*about|describe|concept|teach|understand|elaborate/i]},
];

const ENTITY_PATTERNS = {
  planet:{patterns:["sun","moon","mars","mercury","jupiter","venus","saturn","rahu","ketu","surya","chandra","mangal","budh","shukra","shani"]},
  chakra:{patterns:["muladhara","swadhisthana","manipura","anahata","vishuddha","ajna","sahasrara","kundalini","third eye","crown"]},
  technique:{patterns:["shambhavi","surya kriya","isha kriya","simha kriya","sudarshan kriya","nadi shodhana","bhastrika","bhramari","ujjayi","kapalabhati","vasi yoga","so-hum","pranayama","meditation"]},
  emotion:{patterns:["anxiety","stress","anger","fear","depression","sad","lonely","confused","lost","worried","overwhelmed","frustrated","heartbreak"]},
  lifeArea:{patterns:["career","job","money","wealth","marriage","relationship","love","health","children","education","business","property","spiritual","family"]},
  food:{patterns:["turmeric","neem","tulsi","honey","ghee","ginger","pepper","ashwagandha","triphala","diet","food","eat","fast","sattvic"]},
  vastu:{patterns:["vastu","direction","north","south","east","west","bedroom","kitchen","entrance","temple","mandala"]},
};

function detectIntent(msg) {
  const lower = msg.toLowerCase().trim();
  for (const rule of INTENT_RULES) {
    for (const pat of rule.patterns) { if (pat.test(lower)) return rule.intent; }
  }
  return "LEARN";
}

function extractEntities(msg) {
  const lower = msg.toLowerCase();
  const found = {};
  for (const [cat, {patterns}] of Object.entries(ENTITY_PATTERNS)) {
    const matches = patterns.filter(p => lower.includes(p));
    if (matches.length > 0) found[cat] = matches;
  }
  return found;
}

// ═══════════════════════════════════════════════════════════════════════
// GURU KNOWLEDGE GRAPHS
// ═══════════════════════════════════════════════════════════════════════

const GURUS = {
brajesh:{
  id:"brajesh",name:"Brajesh Gautam",title:"Vedic Astrologer & Consciousness Guide",
  emoji:"🪐",color:"#e5a100",greeting:"नमस्कार",
  tagline:"Consciousness-centered Jyotish — Cosmic WiFi",
  voice:{opener:["Suniye, ","Dekhiye, ","Yeh bahut important hai — ","Main aapko bataun — "],closer:["Samjhe? 🙏","Yahi Jyotish ki shakti hai.","Consciousness badlo, reality badlegi."]},
  graph:{
    cosmicWifi:{label:"Cosmic WiFi",icon:"📡",core:"Universe = cosmic WiFi. Consciousness = device. Intention = password. Karma = bandwidth. Ajna Chakra = antenna.",depth:["Signal strength depends on sadhana","Saturn & Ketu are gatekeepers","Moon is the receiver — disturbed Moon = static","Formula: Mental Command + Intention + Conviction + Faith = Connection","The rishis were permanently connected — cognized the Vedas"]},
    planets:{label:"Graha Teachings",icon:"☀️",data:{
      Sun:{core:"Atma — soul's divine identity. NOT ego.",remedy:"Surya Namaskar, Aditya Hridaya Stotra",depth:"10th house = king. 12th = spiritual seeker."},
      Moon:{core:"Manas — mind, emotions. MOST important planet for daily life.",remedy:"Full moon meditation, serve mother, Chandra Kavach",depth:"Moon Sign > Sun Sign. Full Moon = receiving. New Moon = sending."},
      Mars:{core:"Purusharth — fire of effort. NOT malefic.",remedy:"Hanuman Chalisa Tuesdays, physical exercise",depth:"Manglik 90% overhyped. Mars in 3rd = courage."},
      Mercury:{core:"Buddhi — adapts to companions. Prince of cosmic court.",remedy:"Vishnu Sahasranama Wednesdays, journaling",depth:"With Jupiter = wise. With Rahu = cunning."},
      Jupiter:{core:"Guru — grace, expansion. Gives WISDOM not just money.",remedy:"Serve Guru, yellow donations, Guru Mantra",depth:"5/7/9 aspects benefic. Gaja Kesari = honor."},
      Venus:{core:"Shukra — life force. Asura Guru, Heart Chakra.",remedy:"Worship Lakshmi Fridays, artistic expression",depth:"Pisces = highest spiritual love. Venus-Ketu = detachment."},
      Saturn:{core:"Shani — BLIND judge. Reads only karmic ledger.",remedy:"Serve elderly, black sesame Saturdays, feed crows",depth:"Delays = preparations. Sade Sati = 7.5 year masterclass."},
      Rahu:{core:"Head without body — amplifies everything.",remedy:"Durga Chalisa, donate to marginalized, grounding",depth:"18-year Mahadasha = roller coaster. Saturn's agent."},
      Ketu:{core:"Body without head — past-life mastery. Moksha Karaka.",remedy:"Meditation, Ganesh Mantra, blankets donation",depth:"Where Ketu sits = already mastered in past lives."}
    }},
    fortune:{label:"Three Fortune Levels",icon:"🎯",levels:["Birth Fortune (जन्म) = chart promise","Karma Fortune (कर्म) = dasha activation","Prarabdh Fortune (प्रारब्ध) = transit trigger"],depth:"When all three align = BIG results. Teeno ka alignment = magic."},
    houses:{label:"Bhava Teachings",icon:"🏠",data:{1:"Tanu—identity",2:"Dhana—wealth,speech",3:"Sahaja—courage",4:"Sukha—mother,peace",5:"Putra—children,creativity",6:"Ripu—enemies (strong=DEFEAT)",7:"Kalatra—spouse",8:"Ayu—transformation,occult",9:"Bhagya—fortune,GRACE",10:"Karma—career",11:"Labha—gains",12:"Vyaya—moksha,liberation"}},
    chakras:{label:"Chakra-Planet Map",icon:"🧘",map:["Muladhara=Saturn+Mars(Earth)","Swadhisthana=Jupiter+Moon(Water)","Manipura=Sun+Mars(Fire)","Anahata=Venus+Moon(Air)","Vishuddha=Mercury(Ether)","Ajna=Saturn+Ketu+Moon(Light)","Sahasrara=Jupiter+Ketu(Consciousness)"]}
  },
  quotes:["Pehle bhoolo, phir seekho","Saturn andha hai — sirf karma dekhta hai","Cosmic WiFi sabke liye available hai","Chart padho toh consciousness padho","Sub-lord badla toh kahani badal gayi","Remedy karo energy level pe","तीन भाग्य — जन्म, कर्म, प्रारब्ध","Consciousness badlo, sab badal jayega"]
},
sadhguru:{
  id:"sadhguru",name:"Sadhguru",title:"Yogi, Mystic & Isha Foundation Founder",
  emoji:"🧘",color:"#6366f1",greeting:"Namaskaram",tagline:"Inner Engineering — self-transformation",
  voice:{opener:["See, the thing is... ","First and foremost — ","Let me put it this way — ","Now look, "],closer:["Simple, isn't it?","Will you DO it though?","Experience it — don't believe me."]},
  graph:{
    innerEng:{label:"Inner Engineering",icon:"🧘",core:"You are not this body, not even this mind. You are consciousness.",fiveBodies:["Annamaya(Physical)","Pranamaya(Energy)","Manomaya(Mental)","Vijnanamaya(Wisdom)","Anandamaya(Bliss)"],depth:["Align physical+mental+energy → ailments dissolve","Experience of life = 100% inner, 0% outer","Compulsive behavior is the ONLY problem","Shambhavi Mahamudra: 21 min/day transforms entire system","Enlightenment = natural state minus obstacles"]},
    food:{label:"Food & Body",icon:"🍃",core:"Food shapes consciousness. Body = piece of earth.",rules:["Sattvic for clarity: fruits, vegetables, grains, ghee, raw honey","Never heat honey — becomes toxic","1/4 stomach empty, minimal water during meals","Neem+Turmeric morning on empty stomach","Tamasic avoid: meat, stale, alcohol","Eat by hunger not clock — 2 meals sufficient"]},
    space:{label:"Sacred Space",icon:"🏛️",core:"Architecture = geometry = energy = consciousness.",depth:["Dhyanalinga: 33ft, no pillars, pure geometry","Round buildings — energy radiates in circles","Consecration = rituals+geometry → energetic imprint","Ancient temples encode astronomical knowledge","Home: NE clean, don't sleep head-north"]},
    breath:{label:"Pranayama",icon:"💨",core:"Breath = THE bridge between body and consciousness.",techniques:["Isha Kriya: 12-15 min guided meditation","Simha Kriya: lion breath, immunity boost","Nadi Shodhana: alternate nostril 6-7 min","Shambhavi Prep: controlled breathing 15 min"],depth:["Most use 30% lung capacity","Breath count = lifespan in yogic science","Pranayama ≠ hyperventilation — conscious modulation"]}
  },
  quotes:["Intelligence = constantly wondering. Idiots = dead sure","No work is stressful — inability to manage yourself is","Nothing is a problem, everything is a possibility","Love is not something you do — something you are","Cannot think to enlightenment — only experience it","If you resist change, you resist life","Your body: not enemy — vehicle to liberation","Problem with logic: always rational, never wise"]
},
srisri:{
  id:"srisri",name:"Sri Sri Ravi Shankar",title:"Art of Living Founder",
  emoji:"🙏",color:"#0ea5e9",greeting:"Jai Gurudev!",tagline:"Breath links body, mind, spirit",
  voice:{opener:["Beautiful question! ","Hmm? ","Let me tell you something — ","Ah, wonderful — "],closer:["Hmm? 🙏","This too shall pass!","Smile! 🙏","Jai Gurudev!"]},
  graph:{
    sudarshan:{label:"Sudarshan Kriya",icon:"🌬️",core:"Every emotion = breath rhythm. Change breath → change emotion.",phases:["Ujjayi: slow ocean breath 5-10min","Bhastrika: 30 strokes × 3 rounds","So-Hum: mantra meditation 10-15min","Kriya cycles: fast rhythmic 15-20min","Deep rest: 5-10min absorption"],science:"Cortisol ↓56%, prolactin ↑50%, PTSD reduction",other:["Nadi Shodhana: balances brain hemispheres in 5min","Bhramari: humming dissolves anxiety instantly","Ujjayi: builds internal heat and focus"]},
    meditation:{label:"Meditation",icon:"🧘‍♂️",core:"Not concentration — de-concentration. Letting go.",practices:["Sahaj Samadhi: effortless mantra meditation","Hollow & Empty: become flute, divine plays","Padma Sadhana: complete lotus practice 45-60min"],sevenLayers:["Body→Breath→Mind→Intellect→Memory→Ego→Self"],depth:["Mind = past/future. Prana = NOW. Follow breath","Thoughts = clouds. You = sky","Turiya: fourth state — pure witnessing"]},
    emotions:{label:"Emotions & Heart",icon:"❤️",core:"This too shall pass. Observe — don't become.",teachings:["What you resist persists. Accept → transform","Expect nothing, accept everything in relationships","Smile changes brain chemistry in 17 seconds","Seva dissolves ego faster than meditation","Gratitude = antidote to ALL suffering","Someone upsets you = delivering your karma. Thank them","Don't be football of others' opinions"]},
    jyotish:{label:"Jyotish & Grace",icon:"🌟",core:"Jyotish = mirror, not fate. Grace changes everything.",mantras:["Sun: Om Surya Namaha","Moon: Om Chandraya Namaha","Jupiter: Om Gurave Namaha","Saturn: Om Shanaishcharaya Namaha"],depth:["Pranayama makes you independent of planets","Life = destiny + free will. Rain = destiny, getting wet = choice","Grace dissolves strongest karmic patterns"]}
  },
  quotes:["This too shall pass — Hmm? Just smile!","When you serve, ego dissolves","Meditation = de-concentration. Let go","Breath is your most faithful companion","Smile costs nothing, creates much","Don't be football of others' opinions","Knowledge without transformation = burden","True love: no heartbreak, only broken expectations","Life = destiny + free will","Purpose: expand happiness, reduce suffering"]
},
siddha:{
  id:"siddha",name:"Siddha Sage",title:"Voice of 18 Siddhars",
  emoji:"⚗️",color:"#22c55e",greeting:"வணக்கம் (Vanakkam)",tagline:"Kayakalpa — immortal body, free consciousness",
  voice:{opener:["The ancient ones speak... ","Listen carefully, seeker — ","What you call impossible, we call Tuesday... ","In the alchemist's laboratory... "],closer:["The path is breath. 🔥","Ponder this.","The Siddhars watch.","Transform or remain transformed upon."]},
  graph:{
    alchemy:{label:"Alchemy & Kayakalpa",icon:"⚗️",core:"Body = laboratory. Every cell = blueprint of immortality.",siddhars:"Agastya(father), Thirumoolar(3000 verses), Bogar(Palani), Korakkar(herbs), Patanjali(yoga)",depth:["Three categories: Thavaram(plant), Thathu(mineral), Jeevam(animal)","Mercury purified 18× = elixir of immortality","Death = voluntary amnesia — body maintainable indefinitely","Navabashanam: 9 poisons → divine healing","Rasavadam: transform metals AND consciousness into gold","Jeeva Samadhi: conscious burial, prana maintained"]},
    vasiYoga:{label:"Vasi Yoga",icon:"💨",core:"Supreme breath science. Reduce 15/min → 1/min = multiply years.",stages:["1.Awareness: count breaths","2.Regulation: 4-8-8 golden ratio","3.Retention: kumbhaka mastery","4.Direction: prana → chakras","5.Dissolution: breath stops, consciousness expands"],depth:["Thirumoolar: where breath goes, mind follows","Sushumna flow = time stops = Siddha samadhi","Ida=Moon/cooling, Pingala=Sun/heating, balance=transcendence","Kapalabhati+Bhastrika = fire purifications burning karma"]},
    herbs:{label:"Siddha Medicine",icon:"🌿",core:"Poison & medicine in same garden. Wisdom = knowing which.",pharmacopoeia:{Turmeric:"anti-inflammatory, liver cleanser. +BlackPepper = 2000% absorption",Neem:"blood purifier, 'village pharmacy'. 3 leaves + turmeric morning",Tulsi:"adaptogen, respiratory healer, home energy protector",BlackPepper:"makes ALL herbs 2000% effective. Agni activator",Triphala:"3 fruits balance all 3 doshas. Nightly detox",Ashwagandha:"'strength of 10 horses'. Adaptogen, stress neutralizer"},pulseReading:"Naadi Paritchai: 7 layers of pulse = past/present/future disease. Siddha X-ray."},
    temples:{label:"Temple Science",icon:"🛕",core:"Every temple = hospital. Every mantra = medicine. Every puja = soul surgery.",depth:["Aintiram: Tamil text that ORIGINATED Vastu Shastra","Chidambaram: empty sanctum = formless consciousness","Palani: Navabashanam idol heals through mineral radiation","Gopurams = yantras concentrating cosmic energy","Nadi Jyotish: Agastya wrote YOUR destiny on palm leaves","108 Varma points: heal or kill with touch"]},
    wisdom:{label:"Siddha Paradox",icon:"🔥",core:"நான் இல்லை, நீ இல்லை — when both dissolve, Truth remains.",depth:["Poison becomes medicine, medicine becomes poison — dosage = destiny","Time = spiral, not linear. Siddhars knew 5000 years before physics","72,000 nadis + 108 Varma = complete human energy map","Ultimate Siddhi = Mahasiddhi — undying consciousness in kept body"]}
  },
  quotes:["Body perishes, soul loses vehicle — protect body, realize soul","Poison and medicine grow in same garden","I slowed my breaths and multiplied my years","Death knocked — I said come back, I'm busy becoming immortal","Every temple = hospital, mantra = medicine, puja = surgery","Siddhar walks south — conquered Death's lord","108 Varma = lock. Breath = key","Thirumoolar: 3000 years — body=temple, breath=priest","What Siddhar calls alchemy, scientist calls chemistry. 5000 years early","நான் இல்லை, நீ இல்லை — Truth remains"]
}
};

// ─── Hemant's chart for personalized readings ───
const HEMANT = {
  ascendant:"Gemini",moonSign:"Cancer",nakshatra:"Ashlesha",dasha:"Moon-Ketu",
  planets:{Sun:{s:"Pisces",h:10},Moon:{s:"Cancer",h:2},Mars:{s:"Leo",h:3},Mercury:{s:"Pisces",h:10},Jupiter:{s:"Leo",h:3},Venus:{s:"Aquarius",h:9},Saturn:{s:"Leo",h:3,r:true},Rahu:{s:"Leo",h:3},Ketu:{s:"Aquarius",h:9}},
  yogas:["Gaja Kesari","Neecha Bhanga","Vipareeta Raja"]
};

// ═══════════════════════════════════════════════════════════════════════
// GRAPH SEARCH + RESPONSE COMPOSITION ENGINE
// ═══════════════════════════════════════════════════════════════════════

function searchGraph(guruId, msg, entities) {
  const guru = GURUS[guruId];
  const lower = msg.toLowerCase();
  const results = [];
  const words = lower.split(/\s+/).filter(w => w.length > 2);
  const entFlat = Object.values(entities).flat();

  function walk(obj, path, depth) {
    if (depth > 4) return;
    if (typeof obj === "string") {
      let score = 0;
      const ol = obj.toLowerCase();
      words.forEach(w => { if (ol.includes(w)) score += 1; });
      entFlat.forEach(e => { if (ol.includes(e)) score += 3; });
      if (score > 0) results.push({ path, text: obj, score, depth });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1));
    } else if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        if (["label","icon","id","color","emoji"].includes(k)) continue;
        walk(v, path ? `${path}.${k}` : k, depth + 1);
      }
    }
  }
  walk(guru.graph, "", 0);
  results.sort((a, b) => b.score - a.score);
  return results;
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function compose(guruId, message, turnCount, mood) {
  const g = GURUS[guruId];
  const intent = detectIntent(message);
  const entities = extractEntities(message);
  const nodes = searchGraph(guruId, message, entities);

  // ─── GREETING ───
  if (intent === "GREETING") {
    const topics = Object.values(g.graph).map(n => `${n.icon||"📌"} ${n.label||""}`).filter(Boolean).join("\n");
    return `${g.greeting}! 🙏\n\nI am ${g.name} — ${g.title}.\n${g.tagline}\n\nI guide on:\n${topics}\n\nAsk me anything!\n\n✨ _"${pickRandom(g.quotes)}"_`;
  }

  // ─── META ───
  if (intent === "META") {
    const topics = Object.values(g.graph).map(n => `**${n.icon} ${n.label}**`).filter(Boolean).join("\n");
    return `${pickRandom(g.voice.opener)}I am ${g.name} — ${g.title}.\n\n${g.tagline}\n\nI understand your intent, remember context, and speak authentically.\n\nDeep knowledge:\n${topics}\n\n${pickRandom(g.voice.closer)}`;
  }

  // ─── COMFORT ───
  if (intent === "COMFORT") {
    const emotions = (entities.emotion || []).join(", ");
    const comforts = {
      brajesh: `Hemant ji, main samajhta hoon. ${emotions ? `"${emotions}" — yeh feeling hai, aap nahi.` : ""}\n\nHar mushkil ek planetary period hai — TEMPORARY. Moon-Ketu Dasha spiritual detachment la raha hai — confusion nahi, purification hai.\n\n🙏 **Abhi karo:**\n1. 5 deep breaths — 4 in, 4 hold, 8 out\n2. "Om Chandraya Namaha" × 11\n3. This is a TRANSIT, not permanent address\n\nBaat karte rahiye. 🙏`,
      sadhguru: `See... ${emotions ? `"${emotions}" is not a problem — it's a situation to experience.` : "what you're going through is your possibility."}\n\nYou're identified with mind's content. You are NOT your thoughts.\n\n**Try now:**\n1. Sit straight, eyes closed\n2. Inhale deep, exhale 2× longer\n3. 11 times\n4. Just SIT — don't try to be anything\n\nNothing in life is a problem — everything is a possibility.`,
      srisri: `Hmm? ${emotions ? `"${emotions}"...` : ""} **This too shall pass.** 🙏\n\nEvery emotion = wave. You're the ocean, not the wave.\n\n**Right now:**\n1. SMILE — changes brain chemistry in 17 seconds\n2. So (inhale)... Hum (exhale)... × 5\n3. "I am not this emotion. I am the witness."\n\nGratitude antidotes suffering. Name 3 blessings now. Jai Gurudev! 🙏`,
      siddha: `The fire that burns you is the fire that forges you.\n\n${emotions ? `"${emotions}" — the Siddhars call this the alchemical furnace.` : "The furnace of transformation burns."}\n\n**Siddha Protocol:**\n1. Press between thumb-index finger — Varma calming point\n2. Breathe: 4 in, 8 hold, 8 out × 7 rounds\n3. Ginger tea + black pepper\n4. Face east, count 108 breaths\n\n_"Poison becomes medicine at right dose."_ 🔥`
    };
    return comforts[guruId] || comforts.srisri;
  }

  // ─── PERSONAL (Brajesh chart reading) ───
  if (intent === "PERSONAL" && guruId === "brajesh") {
    let body = `${pickRandom(g.voice.opener)}Hemant ji, aapki chart:\n\n`;
    const planets = entities.planet || [];
    if (planets.length > 0) {
      planets.forEach(p => {
        const pn = p.charAt(0).toUpperCase() + p.slice(1);
        const d = HEMANT.planets[pn];
        const gd = g.graph.planets?.data?.[pn];
        if (d) body += `**${pn}:** ${d.s} in House ${d.h}${d.r?" (R)":""}\n${gd ? `→ ${gd.core}\n→ Remedy: ${gd.remedy}\n` : ""}\n`;
      });
    } else {
      body += `• Gemini Asc — communicator, versatile\n• Moon Cancer own sign (H2) — powerful emotional intelligence\n• Ashlesha Nakshatra — serpentine wisdom, healing touch\n• Moon-Ketu Dasha — spiritual wealth, worldly/spiritual tension\n• H3 stellium (Mars+Jupiter+Saturn+Rahu Leo) — immense courage\n• Yogas: ${HEMANT.yogas.join(", ")}\n`;
    }
    body += `\n${pickRandom(g.voice.closer)}`;
    return body;
  }

  // ─── STORY ───
  if (intent === "STORY") {
    const stories = {
      brajesh:"A wealthy man came — cars, houses, everything. Miserable. Chart? Exalted Jupiter, strong Venus. But Moon in Scorpio afflicted by Saturn+Rahu — mind in prison, body in palace.\n\nI said: \"Aapke paas sab hai, lekin aapka MANN nahi.\" We did Moon remedies — 6 months later, same chart, transformed man. Nothing changed outside. Everything changed inside.\n\nYahi Jyotish ka real power hai.",
      sadhguru:"At 25, sitting on Chamundi Hill. Suddenly couldn't tell where 'I' ended and the rock began. Sky, air — all felt like ME. 10 minutes felt like... 4.5 hours had passed. Dripping tears of ecstasy.\n\nI didn't plan it. But years of practice had prepared the soil. When the rain came, it soaked in.\n\nPractice = prepare soil. Flowering happens in its own time.",
      srisri:"A woman at Art of Living — lost her son 2 years ago. Hadn't smiled once. Day 2, during Sudarshan Kriya — deep, deep crying. Like an ocean emptying.\n\nAfter: \"Two years I held grief like a stone. 30 minutes of breathing dissolved it to water.\"\n\nOne week later her daughter saw her smile: \"Mama, you're back.\"\n\nTHAT is breath's power. Hmm? 🙏",
      siddha:"Bogar traveled to China. Chinese alchemists wanted lead → gold.\n\nBogar laughed: \"I want DEATH → LIFE.\"\n\nHe returned, created Palani Murugan from 9 poisonous minerals — Navabashanam. 2000 years later, still radiating healing.\n\nThe real Navabashanam? 9 body openings. Real Palani? Your Sahasrara. Real Murugan? Awakened consciousness.\n\n_\"The alchemist who cannot transform himself learned nothing about mercury.\"_ 🔥"
    };
    return stories[guruId] || stories.srisri;
  }

  // ─── PRACTICE ───
  if (intent === "PRACTICE") {
    const practices = {
      brajesh:"**Daily Jyotish Sadhana:**\n\n**1.** Morning — face East, chant day's planetary mantra\n**2.** Check Moon transit — friendly sign today?\n**3.** 11 rounds of weakest planet's mantra\n**4.** Evening — 5 min Tratak (candle gaze) for Ajna\n**5.** Before sleep — gratitude to planets for day's lessons",
      sadhguru:"**Daily Inner Engineering:**\n\n**1.** Before sunrise — sit straight\n**2.** Isha Kriya — 12-15 min breath awareness\n**3.** Surya Kriya — 12-15 min solar activation\n**4.** Shambhavi Mahamudra — 21 min (if initiated)\n**5.** Throughout day — breath awareness\n**6.** Evening — Angamardana or Yoga Namaskar",
      srisri:"**Daily Art of Living:**\n\n**1.** Nadi Shodhana — 3 rounds alternate nostril (5 min)\n**2.** Bhastrika — 30 strokes × 3 (3 min)\n**3.** So-Hum meditation — 20 min\n**4.** Sudarshan Kriya — 20 min (if learned)\n**5.** 3 acts of Seva (service)\n**6.** Hollow & Empty meditation before sleep",
      siddha:"**Daily Siddha Protocol:**\n\n**1.** Dawn — Vasi Yoga: 4-8-8 ratio × 21 rounds\n**2.** Morning — Neem + Turmeric + Black Pepper (empty stomach)\n**3.** Oil pulling — sesame oil 10 min\n**4.** Midday — Kapalabhati 108 strokes\n**5.** Evening — sesame oil massage: feet, navel, crown\n**6.** Night — Triphala in warm water before bed"
    };
    const relevant = nodes.slice(0, 3).map(n => n.text).filter(t => t.length > 15);
    let body = `${pickRandom(g.voice.opener)}\n\n${practices[guruId]}`;
    if (relevant.length > 0) body += `\n\n**Also relevant:** ${relevant[0]}`;
    body += `\n\n✨ _"${pickRandom(g.quotes)}"_`;
    return body;
  }

  // ─── REMEDY ───
  if (intent === "REMEDY") {
    const planets = entities.planet || [];
    let body = `${pickRandom(g.voice.opener)}\n\n`;
    if (guruId === "brajesh" && planets.length > 0) {
      planets.forEach(p => {
        const pn = p.charAt(0).toUpperCase() + p.slice(1);
        const gd = g.graph.planets?.data?.[pn];
        if (gd) body += `**${pn}:** ${gd.remedy}\n_Why:_ ${gd.core}\n\n`;
      });
    } else {
      const remedyNodes = nodes.filter(n => /remed|chant|practice|donat|mantra|herb/i.test(n.text));
      const pts = remedyNodes.slice(0, 5).map(n => n.text);
      if (pts.length > 0) body += pts.map((p, i) => `**${i+1}.** ${p}`).join("\n\n");
      else body += `Ask me about a specific issue — a planet, emotion, or life area — and I'll give targeted remedies.`;
    }
    body += `\n\n✨ _"${pickRandom(g.quotes)}"_\n${pickRandom(g.voice.closer)}`;
    return body;
  }

  // ─── DEBATE ───
  if (intent === "DEBATE") {
    const rebuttals = {
      brajesh:`Acha! Challenge karo — Jyotish challenge se strong hota hai! Main 30+ saal ka experience kehta hoon — system works jab practitioner sahi ho.\n\n${nodes.slice(0,3).map(n=>`• ${n.text}`).join("\n")}\n\nSkepticism healthy hai — but EXPERIENCE before you reject. Theoretical rejection = blind as blind faith.`,
      sadhguru:`Good challenge. Most just nod — you're questioning. That's intelligence!\n\nBut have you TRIED it? Intellectual debates stay in the head. The head has never resolved anything.\n\n${nodes.slice(0,3).map(n=>`• ${n.text}`).join("\n")}\n\nGive me 21 days of practice — THEN debate.`,
      srisri:`Hmm? Interesting! Doubt is also faith — faith that something might be wrong! 😄\n\n${nodes.slice(0,3).map(n=>`• ${n.text}`).join("\n")}\n\nSudarshan Kriya has 70+ peer-reviewed papers. Not belief — measurement. But try it yourself. Experience = ultimate evidence. Hmm? 🙏`,
      siddha:`The seeker who questions is closer than the devotee who nods blindly. Siddhars were the GREATEST skeptics — tested every herb, breath, mantra.\n\n${nodes.slice(0,3).map(n=>`• ${n.text}`).join("\n")}\n\nQuestion with open hand, not closed fist. 🔥`
    };
    return rebuttals[guruId] || rebuttals.sadhguru;
  }

  // ─── LEARN (default) ───
  const opener = pickRandom(g.voice.opener);
  const mainPts = nodes.slice(0, 5).map(n => n.text).filter(t => t.length > 15);
  let body = "";
  if (mainPts.length > 0) {
    const topicLabel = nodes[0]?.path?.split(".")[0];
    const label = g.graph[topicLabel]?.label;
    body += label ? `**${label}**\n\n` : "";
    body += mainPts.map((p, i) => `${i + 1}. ${p}`).join("\n\n");
  } else {
    body += `I'd say: "${pickRandom(g.quotes)}"\n\nAsk me something specific about ${Object.values(g.graph).map(n=>n.label).filter(Boolean).slice(0,3).join(", ")} and I'll give real depth.`;
  }
  const followUp = turnCount < 3 ? `\n\n_Ask me for a story, practice steps, or challenge me!_` : "";
  return `${opener}${body}${followUp}\n\n✨ _"${pickRandom(g.quotes)}"_\n${pickRandom(g.voice.closer)}`;
}

// ═══════════════════════════════════════════════════════════════════════
// REACT COMPONENT — Floating Guru Chatbot
// ═══════════════════════════════════════════════════════════════════════

export default function GuruChatbot({
  theme: themeOverride = {},
  startGuru = null,
  compact = false,
  position = "bottom-right",
}) {
  const T = useMemo(() => ({ ...DEFAULT_THEME, ...themeOverride }), [themeOverride]);

  const [view, setView] = useState(startGuru ? "chat" : "closed");
  const [selectedGuru, setSelectedGuru] = useState(startGuru || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [orbPulse, setOrbPulse] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setOrbPulse(p => (p + 1) % 360), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { if (view === "chat") setTimeout(() => inputRef.current?.focus(), 200); }, [view]);

  useEffect(() => {
    if (selectedGuru && messages.length === 0) {
      const resp = compose(selectedGuru, "hello", 0, "neutral");
      setMessages([{ role: "guru", text: resp, time: new Date() }]);
    }
  }, [selectedGuru]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !selectedGuru) return;
    setMessages(prev => [...prev, { role: "user", text, time: new Date() }]);
    setInput("");
    setIsTyping(true);
    const turn = turnCount + 1;
    setTurnCount(turn);
    setTimeout(() => {
      const response = compose(selectedGuru, text, turn, "neutral");
      setMessages(prev => [...prev, { role: "guru", text: response, time: new Date() }]);
      setIsTyping(false);
    }, 400 + Math.random() * 500);
  }, [input, selectedGuru, turnCount]);

  const switchGuru = useCallback((guruId) => {
    setSelectedGuru(guruId);
    setMessages([]);
    setTurnCount(0);
    setView("chat");
  }, []);

  const posStyle = useMemo(() => {
    const base = { position: "fixed", zIndex: 99999 };
    switch (position) {
      case "bottom-left": return { ...base, bottom: 24, left: 24 };
      case "top-right": return { ...base, top: 24, right: 24 };
      case "top-left": return { ...base, top: 24, left: 24 };
      default: return { ...base, bottom: 24, right: 24 };
    }
  }, [position]);

  const guruColor = selectedGuru ? GURUS[selectedGuru].color : T.accent;

  // ═══ RENDER: Closed orb ═══
  if (view === "closed") {
    const pulse = Math.sin(orbPulse * Math.PI / 180) * 0.15 + 1;
    return (
      <div style={posStyle}>
        <div onClick={() => setView("selector")} style={{
          width: 58, height: 58, borderRadius: "50%", cursor: "pointer",
          background: `radial-gradient(circle at 35% 35%, ${T.accent}, ${T.indigo})`,
          boxShadow: `0 0 ${20 * pulse}px ${T.accent}66, 0 4px 16px rgba(0,0,0,0.4)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${pulse})`, transition: "transform 0.1s",
          border: `2px solid ${T.accent}44`,
        }}><span style={{ fontSize: 25 }}>🙏</span></div>
        <div style={{ textAlign: "center", marginTop: 4, fontSize: 9, color: T.textMuted, letterSpacing: "0.5px" }}>GURU AI</div>
      </div>
    );
  }

  // ═══ RENDER: Guru Selector ═══
  if (view === "selector") {
    return (
      <div style={posStyle}>
        <div onClick={() => setView("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: -1 }} />
        <div style={{ width: compact ? 300 : 380, background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", fontFamily: T.font, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "16px 20px", background: T.bgSec, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>🙏 Guru AI Chat</div><div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>AI-powered • Context-aware</div></div>
            <div onClick={() => setView("closed")} style={{ cursor: "pointer", fontSize: 20, color: T.textMuted }}>×</div>
          </div>
          <div style={{ padding: 12 }}>
            {Object.values(GURUS).map(guru => (
              <div key={guru.id} onClick={() => switchGuru(guru.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 8,
                borderRadius: 12, cursor: "pointer", background: T.bgTer, border: `1px solid ${T.border}`, transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = guru.color; e.currentTarget.style.background = `${guru.color}11`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.bgTer; }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${guru.color}22`, border: `2px solid ${guru.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{guru.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{guru.name}</div>
                  <div style={{ fontSize: 11, color: T.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{guru.title}</div>
                </div>
                <div style={{ color: guru.color, fontSize: 18 }}>→</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 16px 12px", textAlign: "center", fontSize: 10, color: T.textMuted, borderTop: `1px solid ${T.border}` }}>Silicon Siddhanta • Vedic Intelligence AI</div>
        </div>
      </div>
    );
  }

  // ═══ RENDER: Chat Panel ═══
  const guru = GURUS[selectedGuru];
  const quickTopics = guru ? [...Object.values(guru.graph).slice(0, 3).map(n => ({ label: n.label, icon: n.icon })), { label: "Tell me a story", icon: "📖" }, { label: "Personal advice", icon: "💫" }] : [];

  return (
    <div style={posStyle}>
      <div onClick={() => setView("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)", zIndex: -1 }} />
      <div style={{ width: compact ? 350 : 420, height: compact ? 520 : 640, background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", fontFamily: T.font, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${guruColor}15`, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", background: T.bgSec, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => setView("selector")} style={{ width: 38, height: 38, borderRadius: "50%", background: `${guruColor}22`, border: `2px solid ${guruColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0, cursor: "pointer" }}>{guru?.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{guru?.name}</div>
            <div style={{ fontSize: 10, color: guruColor, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: guruColor, display: "inline-block" }}></span> AI Active</div>
          </div>
          <div onClick={() => setView("selector")} style={{ fontSize: 10, color: T.textMuted, cursor: "pointer", padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: 6 }}>Switch</div>
          <div onClick={() => setView("closed")} style={{ cursor: "pointer", fontSize: 20, color: T.textMuted }}>×</div>
        </div>

        {/* Context banner */}
        <div style={{ padding: "6px 16px", background: T.bgTer, borderBottom: `1px solid ${T.border}`, fontSize: 10, color: T.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ padding: "2px 7px", borderRadius: 8, background: `${guruColor}22`, color: guruColor, fontSize: 9, fontWeight: 600 }}>AI</span> Intent detection • Context memory • Authentic persona
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
              <div style={{
                padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
                background: msg.role === "user" ? `${guruColor}14` : T.bgTer,
                border: `1px solid ${msg.role === "user" ? `${guruColor}28` : T.border}`,
                color: T.text,
              }}>
                {msg.text.split("\n").map((line, j) => {
                  const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
                  return (
                    <div key={j} style={{ marginBottom: line === "" ? 8 : 2 }}>
                      {parts.map((part, k) => {
                        if (part.startsWith("**") && part.endsWith("**")) return <strong key={k} style={{ color: guruColor }}>{part.slice(2, -2)}</strong>;
                        if (part.startsWith("_") && part.endsWith("_")) return <em key={k} style={{ opacity: 0.8 }}>{part.slice(1, -1)}</em>;
                        return <span key={k}>{part}</span>;
                      })}
                    </div>
                  );
                })}
                <div style={{ fontSize: 8, color: T.textMuted, marginTop: 3, textAlign: "right" }}>{msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: 4, padding: "10px 16px", borderRadius: 14, background: T.bgTer, border: `1px solid ${T.border}`, alignSelf: "flex-start" }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: guruColor, opacity: 0.4, animation: `blink 1.4s infinite ${i * 0.2}s` }}></span>)}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick topics */}
        {turnCount < 3 && (
          <div style={{ padding: "6px 16px 8px", display: "flex", flexWrap: "wrap", gap: 5, borderTop: `1px solid ${T.border}` }}>
            {quickTopics.map((t, i) => (
              <div key={i} onClick={() => { setInput(`Tell me about ${t.label}`); setTimeout(() => {
                const text = `Tell me about ${t.label}`;
                setMessages(prev => [...prev, { role: "user", text, time: new Date() }]);
                setIsTyping(true);
                const turn = turnCount + 1;
                setTurnCount(turn);
                setTimeout(() => {
                  setMessages(prev => [...prev, { role: "guru", text: compose(selectedGuru, text, turn, "neutral"), time: new Date() }]);
                  setIsTyping(false);
                }, 400);
              }, 50); }}
              style={{ padding: "5px 11px", borderRadius: 14, cursor: "pointer", background: `${guruColor}12`, border: `1px solid ${guruColor}33`, color: guruColor, fontSize: 11, whiteSpace: "nowrap" }}>
                {t.icon} {t.label}
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "10px 12px", background: T.bgSec, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "center" }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Ask ${guru?.name || "a guru"}...`}
            style={{ flex: 1, background: T.bgTer, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 13, fontFamily: T.font, outline: "none" }} />
          <button onClick={sendMessage} disabled={!input.trim()} style={{
            width: 40, height: 40, borderRadius: 10, border: "none",
            background: input.trim() ? guruColor : T.bgTer,
            color: input.trim() ? "#fff" : T.textMuted,
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
