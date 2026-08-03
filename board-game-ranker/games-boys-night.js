// Board game list — the "Boys Night" set, 32 titles (a power of 2, no byes
// needed).
//
// Fields:
//   id      — slug used as a stable key for art lookup
//   title   — display title shown on cards
//   players — player-count range, as a display string (e.g. "2-4")
//   time    — playtime in minutes
//   bggId   — (optional) BoardGameGeek thing ID. Used for reference; not
//             required by the current art fetcher.
//   art     — (optional) explicit thumbnail URL override. If set,
//             fetch-art.js uses it instead of looking the title up in the
//             saved collection HTML. Handy for games on pages of your BGG
//             collection you didn't save.
window.ITEMS_BOYS_NIGHT = [
  { id: "space-base",             title: "Space Base",              players: "2-4", time: 45,  bggId: 242302 },
  { id: "skull",                  title: "Skull",                   players: "3-6", time: 45,  bggId: 92415 },
  { id: "quacks",                 title: "The Quacks of Quedlinburg", players: "2-4", time: 45,  bggId: 244521 },
  { id: "startups",               title: "Startups",                players: "3-7", time: 20,  bggId: 223770 },
  { id: "king-of-tokyo",          title: "King of Tokyo",           players: "2-6", time: 30,  bggId: 70323 },
  { id: "cockroach-poker-royal",  title: "Cockroach Poker Royal",   players: "2-6", time: 25,  bggId: 129736 },
  { id: "android-infiltration",   title: "Android: Infiltration",   players: "2-6", time: 45,  bggId: 118063 },
  { id: "kemet",                  title: "Kemet",                   players: "2-5", time: 120, bggId: 127023 },
  { id: "dune-imperium",          title: "Dune: Imperium",          players: "1-4", time: 120, bggId: 316554, art: "https://cf.geekdo-images.com/PhjygpWSo-0labGrPBMyyg__itemrep/img/3_xJ0tO5L62bUp2oRfjeVS0DHX0=/fit-in/246x300/filters:strip_icc()/pic5666597.jpg" },
  { id: "quest-for-el-dorado",    title: "The Quest for El Dorado", players: "2-4", time: 60,  bggId: 217372, art: "https://cf.geekdo-images.com/b5VyYjNfAxJ4Z-Dx2UWlqg__itemrep/img/Z-KZ-Yp6UUePDqP4m94GmJZWbaM=/fit-in/246x300/filters:strip_icc()/pic7945692.jpg" },
  { id: "ra",                     title: "Ra",                      players: "2-5", time: 60,  bggId: 12 },
  { id: "great-western-trail",    title: "Great Western Trail",     players: "2-4", time: 150, bggId: 193738 },
  { id: "cyclades",               title: "Cyclades",                players: "2-5", time: 90,  bggId: 54998 },
  { id: "oceans",                 title: "Oceans",                  players: "2-4", time: 90,  bggId: 232414, art: "https://cf.geekdo-images.com/1J7_qmdohyypZNyvu8B45A__itemrep/img/bfEFe9suHp6jpeS5t2EIkArZW94=/fit-in/246x300/filters:strip_icc()/pic4382323.jpg" },
  { id: "san-juan",               title: "San Juan",                players: "2-4", time: 60,  bggId: 8217 },
  { id: "ego",                    title: "EGO",                     players: "2-5", time: 80,  bggId: 429766 },
  { id: "no-thanks",              title: "No Thanks!",              players: "3-7", time: 20,  bggId: 12942 },
  { id: "point-galaxy",           title: "Point Galaxy",            players: "2-4", time: 30,  bggId: 431998 },
  { id: "fishing",                title: "Fishing",                 players: "3-5", time: 60,  bggId: 419195 },
  { id: "clank-in-space",         title: "Clank! In! Space!",       players: "2-4", time: 90,  bggId: 233371, art: "https://cf.geekdo-images.com/haDQw7X8Z0VOItfow9eDtg__itemrep/img/cw4PJPh9WSElsJk0SFPe8Ddus34=/fit-in/246x300/filters:strip_icc()/pic3720843.jpg" },
  { id: "power-grid",             title: "Power Grid",              players: "2-6", time: 120, bggId: 2651 },
  { id: "cities",                 title: "Cities",                  players: "2-4", time: 45,  bggId: 402676 },
  { id: "bosa",                   title: "Bosa",                    players: "2-5", time: 45,  bggId: 416281, art: "https://cf.geekdo-images.com/EhhtVlrI4B5CMzsRhgJQTg__itemrep/img/HiC70Gp-fkNEzvWdaK3_psRcWIo=/fit-in/246x300/filters:strip_icc()/pic8090959.jpg" },
  { id: "sea-salt-paper",         title: "Sea Salt & Paper",        players: "2-4", time: 30,  bggId: 367220 },
  { id: "root",                   title: "Root",                    players: "2-4", time: 90,  bggId: 237182 },
  { id: "love-letter",            title: "Love Letter",             players: "2-4", time: 20,  bggId: 129622 },
  { id: "reef",                   title: "Reef",                    players: "2-4", time: 45,  bggId: 244228, art: "https://cf.geekdo-images.com/I3BgmkjP3g6cRQ4cejoHrg__itemrep/img/qteYh1HXRRldnM1XNjHyzeQx7jk=/fit-in/246x300/filters:strip_icc()/pic5376430.png" },
  { id: "daybreak",               title: "Daybreak",                players: "1-4", time: 120, bggId: 334986 },
  { id: "barenpark",              title: "Bärenpark",               players: "2-4", time: 45,  bggId: 219513 },
  { id: "lords-of-waterdeep",     title: "Lords of Waterdeep",      players: "2-5", time: 120, bggId: 110327 },
  { id: "galaxy-trucker",         title: "Galaxy Trucker",          players: "2-4", time: 60,  bggId: 31481 },
  { id: "small-world",            title: "Small World",             players: "2-5", time: 80,  bggId: 40692 },
];
