export const AGENTS_DATA = {
  Jett: { role: "Duelist", abilities: ["Cloudburst", "Updraft", "Tailwind", "Blade Storm"] },
  Phoenix: { role: "Duelist", abilities: ["Curveball", "Hot Hands", "Blaze", "Run It Back"] },
  Raze: { role: "Duelist", abilities: ["Paint Shells", "Blast Pack", "Boom Bot", "Showstopper"] },
  Reyna: { role: "Duelist", abilities: ["Leer", "Devour", "Dismiss", "Empress"] },
  Yoru: { role: "Duelist", abilities: ["Fakeout", "Blindside", "Gatecrash", "Dimensional Drift"] },
  Neon: { role: "Duelist", abilities: ["Fast Lane", "Relay Bolt", "High Gear", "Overdrive"] },
  
  Omen: { role: "Controller", abilities: ["Paranoia", "Dark Cover", "Shrouded Step", "From the Shadows"] },
  Viper: { role: "Controller", abilities: ["Snake Bite", "Poison Cloud", "Toxic Screen", "Viper's Pit"] },
  Brimstone: { role: "Controller", abilities: ["Stim Beacon", "Sky Smoke", "Incendiary", "Orbital Strike"] },
  Astra: { role: "Controller", abilities: ["Nebula", "Gravity Well", "Nova Pulse", "Cosmic Divide"] },
  Harbor: { role: "Controller", abilities: ["High Tide", "Cove", "Reckoning", "Cascade"] },
  
  Sova: { role: "Initiator", abilities: ["Owl Drone", "Shock Bolt", "Recon Bolt", "Hunter's Fury"] },
  Breach: { role: "Initiator", abilities: ["Aftershock", "Flashpoint", "Fault Line", "Rolling Thunder"] },
  Skye: { role: "Initiator", abilities: ["Guiding Light", "Regrowth", "Trailblazer", "Seekers"] },
  Kayo: { role: "Initiator", abilities: ["Zero/Point", "Flash/Drive", "Frag/ment", "NULL/cmd"] },
  Fade: { role: "Initiator", abilities: ["Prowler", "Seize", "Haunt", "Nightfall"] },
  Gekko: { role: "Initiator", abilities: ["Wingman", "Dizzy", "Mosh Pit", "Thrash"] },
  
  Killjoy: { role: "Sentinel", abilities: ["Nanoswarm", "Alarmbot", "Turret", "Lockdown"] },
  Cypher: { role: "Sentinel", abilities: ["Trapwire", "Cyber Cage", "Spycam", "Neural Theft"] },
  Sage: { role: "Sentinel", abilities: ["Barrier Orb", "Slow Orb", "Healing Orb", "Resurrection"] },
  Chamber: { role: "Sentinel", abilities: ["Trademark", "Headhunter", "Rendezvous", "Tour De Force"] },
  Deadlock: { role: "Sentinel", abilities: ["GravNet", "Sonic Sensor", "Barrier Mesh", "Annihilation"] }
};

export const MAPS = ["Ascent", "Bind", "Haven", "Split", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus"];

export const AGENT_WINRATES = {
  "Ascent": { "Jett": 54.2, "Omen": 52.7, "Killjoy": 50.8, "Sova": 51.3, "Reyna": 53.1 },
  "Bind": { "Raze": 55.1, "Viper": 51.9, "Yoru": 52.3, "Brimstone": 50.5, "Phoenix": 51.7 },
  "Haven": { "Jett": 54.2, "Omen": 52.7, "Killjoy": 50.8, "Sage": 51.2, "Skye": 50.3 },
  "Split": { "Breach": 52.8, "Viper": 53.4, "Killjoy": 51.9, "Jett": 52.1, "Omen": 51.5 },
  "Icebox": { "Sova": 53.7, "Raze": 52.9, "Killjoy": 51.3, "Jett": 51.8, "Viper": 52.2 },
  "Breeze": { "Jett": 55.3, "Sova": 52.1, "Chamber": 51.7, "Omen": 50.9, "Raze": 52.8 },
  "Fracture": { "Kayo": 52.4, "Fade": 51.8, "Raze": 52.1, "Jett": 51.9, "Killjoy": 51.2 },
  "Pearl": { "Astra": 52.6, "Jett": 53.1, "Sova": 51.7, "Killjoy": 51.4, "Omen": 51.0 },
  "Lotus": { "Harbor": 51.3, "Viper": 52.7, "Sova": 52.0, "Jett": 52.4, "Killjoy": 51.6 }
};
