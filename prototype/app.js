// Pitch In prototype: front end only, seeded demo data, state kept in this browser.
(() => {
'use strict';

// ---------- seed data ----------
const DAYS = [
  { id: 'fri', label: 'Fri', name: 'Friday', full: 'Friday, September 4', sunset: '7:43 PM' },
  { id: 'sat', label: 'Sat', name: 'Saturday', full: 'Saturday, September 5', sunset: '7:41 PM' },
  { id: 'sun', label: 'Sun', name: 'Sunday', full: 'Sunday, September 6', sunset: '7:39 PM' },
  { id: 'mon', label: 'Mon', name: 'Monday', full: 'Monday, September 7', sunset: '7:37 PM' },
];
const DAY_IDX = { fri: 0, sat: 1, sun: 2, mon: 3 };
const dayOf = (id) => DAYS.find((d) => d.id === id);
const S = 'Shaman Stage', M = 'Main Stage';
const t = (h, m = 0) => h * 60 + m;
const abs = (day, min) => DAY_IDX[day] * 1440 + min;
const SETS = [
  ['fri', S, t(16), 'Thirsty For Space'], ['fri', S, t(19), 'Aladdin Road ~ Steven Padilla'], ['fri', S, t(20, 30), 'Duffy Owens'],
  ['fri', M, t(16, 30), 'The Bill Davis Band'], ['fri', M, t(18), 'Rosy Rock & Roll ~ Featuring Cindy Avery'], ['fri', M, t(19, 30), 'Lowdown Gamblers'], ['fri', M, t(21), 'Mama Dirty Skirt'],
  ['sat', M, t(11), 'Breakfast with The Dyrbs'], ['sat', M, t(13), 'The Pourboys'], ['sat', M, t(15), 'Donna Ray Band'], ['sat', M, t(17), 'Howard Levy Duo'], ['sat', M, t(19), 'Unbound with Friends'], ['sat', M, t(21), "Who's Your Daddy"],
  ['sat', S, t(12), '2Old2B Famous'], ['sat', S, t(14), 'Culler Seelye & Company'], ['sat', S, t(16), 'Delta Promenade'], ['sat', S, t(18), 'Dangerous Curves'], ['sat', S, t(20), 'The Go4s'],
  ['sun', S, t(11), 'Tom & Jill'], ['sun', S, t(13), 'Denny & The Jeffs'], ['sun', S, t(15), 'Coyote Creek'], ['sun', S, t(17), 'Midnight Café ~ Greg Murat'],
  ['sun', M, t(12), 'Pitman-Sutton Band'], ['sun', M, t(14), 'McPage & Powell'], ['sun', M, t(16), 'Bobby Holland & The Breadline'], ['sun', M, t(18), "Vaughn Jensen's All-Star Jam"], ['sun', M, t(19), 'Fire Drill / Harmonica Hell'], ['sun', M, t(19, 45), 'Nick Mardon Trio'], ['sun', M, t(21), 'The Davanos'],
  ['mon', S, t(11), 'Tim Ogard'], ['mon', S, t(13), 'The McCarters'], ['mon', S, t(15), 'Nicholas Russell'], ['mon', S, t(17), 'Eric Kosarot & Jonah Roth'], ['mon', S, t(19), 'Plumb Tuckered'],
  ['mon', M, t(12), 'The Bel Reds'], ['mon', M, t(14), 'Carissa Ashley Band'], ['mon', M, t(16), 'Dale Spalding Band'], ['mon', M, t(18), 'Ron Hendee and Friends'], ['mon', M, t(20), "NoMomma ~ Marc Lagen's Tribute to Sheri Roberts Greimes ~ Featuring Stacy Jones"],
].map(([day, stage, start, name], i) => ({ id: 's' + i, day, stage, start, name, fans: 8 + ((i * 17) % 41) }));

// Needs appear at `from` and drop off after `due`; times are minutes from Friday midnight.
const NEEDS = [
  { id: 'setup', title: 'Shaman Stage setup crew', team: 'Lights and sound', urgency: 'critical', qty: 6, unit: 'people', covered: 4, from: abs('fri', t(8)), due: abs('fri', t(15)), where: 'Shaman Stage', desc: 'Lift and place the deck panels, run power, hang the shade cloth. Gloves help.' },
  { id: 'cooks', title: 'Breakfast cooks', team: 'Kitchen', urgency: 'soon', qty: 3, unit: 'people', covered: 1, from: abs('fri', t(18)), due: abs('sat', t(8)), where: 'Kitchen', desc: 'Pancakes and eggs for the early crowd. Two-hour shift.' },
  { id: 'jugs', title: 'Refill the water jugs', team: 'Kitchen', urgency: 'soon', qty: 2, unit: 'people', covered: 0, from: abs('sun', t(12)), due: abs('sun', t(14)), where: 'Water station', quick: true, desc: 'Carry the empty jugs to the spigot by the barn and back. About 20 minutes.' },
  { id: 'cords', title: 'Extension cords, 50 ft', team: 'Lights and sound', urgency: 'whenever', qty: 3, unit: 'cords', covered: 1, from: abs('sat', t(9)), due: null, where: 'Main Stage', home: true, desc: 'Outdoor-rated, 12 or 14 gauge. Put your name on a strip of tape so it comes home with you.' },
  { id: 'ice', title: 'Bags of ice', team: 'Kitchen', urgency: 'critical', qty: 20, unit: 'bags', covered: 5, from: abs('mon', t(10)), due: abs('mon', t(15)), where: 'Kitchen cooler', desc: 'Ten-pound bags. The coolers for the burger patties are the priority.' },
  { id: 'cones', title: 'Traffic cones', team: 'Parking', urgency: 'critical', qty: 12, unit: 'cones', covered: 8, from: abs('mon', t(9)), due: abs('mon', t(16)), where: 'Gate', home: true, desc: 'To mark the overflow lot by the barn before the evening crowd arrives.' },
  { id: 'trash', title: 'Trash run to the dumpster', team: 'Kitchen', urgency: 'soon', qty: 2, unit: 'people', covered: 0, from: abs('mon', t(13)), due: abs('mon', t(15, 30)), where: 'Behind the serving tent', quick: true, desc: 'Four bags and the recycling bin. Takes about 15 minutes with a wagon.' },
  { id: 'tarps', title: 'Tarps for the merch booth', team: 'Info booth', urgency: 'soon', qty: 4, unit: 'tarps', covered: 0, from: abs('mon', t(11)), due: abs('mon', t(17)), where: 'Merch booth', home: true, desc: 'Rain is possible tonight. Any size over 8 × 10 ft.' },
  { id: 'dish', title: 'Dish crew', team: 'Kitchen', urgency: 'soon', qty: 4, unit: 'people, 2 hours', covered: 2, from: abs('mon', t(12)), due: abs('mon', t(18)), where: 'Kitchen', desc: 'Wash, rinse, sanitize. Aprons and gloves are on the hook by the sink.' },
];
const URG = { critical: 'Critical', soon: 'Needed soon', whenever: 'Whenever' };
const URG_ORDER = { critical: 0, soon: 1, whenever: 2 };
const NAMES = ['Dee', 'Sam', 'Big Mike', 'Lou', 'Kat', 'Rosie', 'Ty', 'June'];
const PLACES = ['Kitchen', 'Kitchen cooler', 'Gate', 'Main Stage', 'Shaman Stage', 'Info booth', 'Merch booth'];
const TEMPLATES = [
  { label: 'Ice run', title: 'Bags of ice', qty: 10, unit: 'bags', where: 'Kitchen cooler', urgency: 'soon' },
  { label: 'Firewood', title: 'Firewood', qty: 6, unit: 'armloads', where: 'Kitchen', urgency: 'whenever', home: true },
  { label: 'Trash haul', title: 'Trash run to the dumpster', qty: 2, unit: 'people', where: 'Kitchen', urgency: 'soon', quick: true },
  { label: 'Dish crew', title: 'Dish crew', qty: 3, unit: 'people, 2 hours', where: 'Kitchen', urgency: 'soon' },
];

const CREWS = [
  { id: 'kitchen', name: 'Kitchen', desc: 'Cooking, serving, dishes', open: true, members: 18, pinned: 'Radio channel 3. Spare propane is behind the serving tent.' },
  { id: 'sound', name: 'Lights and sound', desc: 'Stage power, mics, changeovers', open: false, members: 9, pinned: 'Changeovers are 15 minutes. Channel 5 on the radios.' },
  { id: 'parking', name: 'Parking', desc: 'Directing cars at the gate and lots', open: true, members: 12, pinned: 'Vests and flashlights are in the gate shed.' },
  { id: 'security', name: 'Security', desc: 'Overnight walks, first contact for help', open: false, members: 7, pinned: 'Night walks start at 10 PM. Check in at the info booth.' },
  { id: 'info', name: 'Info booth', desc: 'Answering questions, lost and found', open: true, members: 6, pinned: 'Lost and found box is under the info table.' },
  { id: 'photo', name: 'Photo team', desc: 'Curating the Freedom Fest album', open: true, members: 5, pinned: 'Pick Organizer picks from Crowd favorites first.' },
];
const SEED_MSGS = {
  kitchen: [
    { who: 'Rosie', role: 'lead', color: '#8F72F0', text: "Burgers are moving fast. We'll be out of buns by 6.", need: 'ice' },
    { who: 'Dee', color: '#2DB36B', text: 'Claimed 3 bags. Store run in 10.' },
    { who: 'Big Mike', color: '#F28B22', text: 'Block ice works too. Leave it at the cooler, not by the grill.' },
  ],
  sound: [{ who: 'Lou', role: 'lead', color: '#2F63D6', text: 'Main Stage monitors are dialed in. Shaman needs one more DI box.' }],
  parking: [{ who: 'Ty', role: 'lead', color: '#D62B34', text: 'Lot B is full. Send cars to the field past the barn.', need: 'cones' }],
  security: [{ who: 'June', role: 'lead', color: '#0B1328', text: 'Quiet night so far. Two walkers on the creek loop.' }],
  info: [{ who: 'Kat', role: 'lead', color: '#F28B22', text: 'Someone turned in a blue water bottle with stickers. It is in the box.' }],
  photo: [{ who: 'Sam', role: 'lead', color: '#2DB36B', text: 'Sunset shots from Saturday are great. Hearts welcome.' }],
  leads: [{ who: 'Lou', color: '#2F63D6', text: 'Changeover at 3 is tight. Sound needs two extra hands.' }],
  rosie: [{ who: 'Rosie', color: '#8F72F0', text: 'Thanks for jumping on the ice! Drop it at the blue cooler.' }],
};

const FUND = { raised: 8420, goal: 15000, donors: 163 }; // placeholder numbers
const AMOUNTS = [10, 25, 50, 100];
const PRODUCTS = [
  { id: 'tee', name: 'Freedom Fest 2026 tee', price: 25, sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], blurb: 'Black, flyer art on the front.' },
  { id: 'stickers', name: 'Sticker pack', price: 5, blurb: 'Five weatherproof stickers.' },
];
const SHIP = 6;
const PALETTE = ['#2DB36B', '#2F63D6', '#F9D84A', '#F28B22', '#D62B34', '#8F72F0'];

// ---------- state (persists in this browser; Reset demo clears it) ----------
const KEY = 'pitchin-demo-v2';
const fresh = () => ({
  now: { day: 'mon', min: t(14, 30) }, role: 'helper',
  stars: [], remind: {}, reminded: {}, shifts: [], cancelled: {}, cascade: true,
  claims: {}, posted: [], closed: {}, needFilter: 'all',
  msgs: {}, joined: {}, scheduleDay: null,
  gifts: [], amount: 25, method: 'venmo', cart: [], orders: [], ship: false,
});
let st = fresh();
try { st = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (min) => { const m24 = ((min % 1440) + 1440) % 1440, h = Math.floor(m24 / 60), m = m24 % 60, h12 = ((h + 11) % 12) + 1; return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const money = (n) => '$' + n.toLocaleString('en-US');
const nowAbs = () => abs(st.now.day, st.now.min);
const clockLabel = () => `${dayOf(st.now.day).label} ${fmt(st.now.min)}`;
const signedIn = () => st.role !== 'public';
const isLead = () => st.role === 'lead';
const isMember = (id) => st.joined[id] === 'member' || (id === 'kitchen' && isLead());
const absLabel = (a) => { const d = DAYS[Math.floor(a / 1440)]; return (d.id === st.now.day ? '' : d.label + ' ') + fmt(a % 1440); };

function toast(msg) {
  document.querySelectorAll('.toast').forEach((x) => x.remove());
  const el = document.createElement('div'); el.className = 'toast' + (document.querySelector('.scrim') ? ' over-sheet' : ''); el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3200);
}
function sheet(html, onMount) {
  document.querySelectorAll('.scrim').forEach((x) => x.remove());
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  scrim.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  const close = () => scrim.remove();
  scrim.addEventListener('click', (e) => { if (e.target === scrim || e.target.closest('[data-close]')) close(); });
  document.body.appendChild(scrim); onMount && onMount(scrim.firstElementChild, close);
}
const qr = (seed) => `<div class="qr" aria-hidden="true">${Array.from({ length: 121 }, (_, i) => {
  const x = i % 11, y = Math.floor(i / 11), corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
  return corner || ((i * 37 + (i >> 3) * 11 + seed * 7) % 5 < 2) ? '<b></b>' : '<i></i>';
}).join('')}</div>`;

// ---------- schedule logic: one band plays at a time, so a set runs until the next set starts on either stage ----------
const LAST_SET_MIN = 120; // assumed length of the day's final set
const shiftOf = (s) => st.shifts.reduce((a, x) => a + (x.id === s.id || (x.cascade && x.day === s.day && s.start > x.start) ? x.min : 0), 0);
const startOf = (s) => s.start + shiftOf(s);
const isCancelled = (s) => !!st.cancelled[s.id];
const daySets = (day) => SETS.filter((s) => s.day === day && !isCancelled(s)).sort((a, b) => startOf(a) - startOf(b));
const setEnd = (s) => {
  const later = daySets(s.day).filter((x) => startOf(x) > startOf(s)).map(startOf);
  return later.length ? Math.min(...later) : startOf(s) + LAST_SET_MIN;
};
function onNow() {
  const list = daySets(st.now.day);
  const cur = list.find((s) => startOf(s) <= st.now.min && st.now.min < setEnd(s)) || null;
  const next = list.find((s) => startOf(s) > st.now.min) || null;
  return { cur, next };
}
const isOn = (s) => s.day === st.now.day && onNow().cur === s;
const setAbs = (s) => abs(s.day, startOf(s));

// ---------- needs logic ----------
const allNeeds = () => NEEDS.concat(st.posted);
const covered = (n) => Math.min(n.qty, n.covered + (st.claims[n.id] || 0));
const visibleNeeds = () => {
  const a = nowAbs();
  return allNeeds().filter((n) => !st.closed[n.id] && n.from <= a && (n.due == null || a <= n.due))
    .sort((x, y) => (covered(x) >= x.qty) - (covered(y) >= y.qty) || URG_ORDER[x.urgency] - URG_ORDER[y.urgency] || (x.due ?? 1e9) - (y.due ?? 1e9));
};
const dueLabel = (n) => (n.due == null ? 'Any time' : 'By ' + absLabel(n.due));
function claimants(n) {
  const out = []; let left = n.covered, i = n.id.length;
  while (left > 0) { const q = Math.min(left, 1 + (i % 3)); out.push([NAMES[i % NAMES.length], q]); left -= q; i += 3; }
  if (st.claims[n.id]) out.push(['You', st.claims[n.id]]);
  return out;
}

// ---------- fundraising ----------
const raised = () => FUND.raised + st.gifts.reduce((a, g) => a + g.amount, 0);
const donors = () => FUND.donors + st.gifts.length;
const pctOf = (v) => Math.min(100, Math.round((v / FUND.goal) * 100));
const cartTotal = () => st.cart.reduce((a, i) => a + PRODUCTS.find((p) => p.id === i.id).price * i.qty, 0);
const cartCount = () => st.cart.reduce((a, i) => a + i.qty, 0);

// ---------- page header ----------
const SLIDERS = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h8M15 6h2M3 14h2M9 14h8"/><circle cx="13" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg>';
const DRIPS = PALETTE.concat(PALETTE).map((c, i) => `<i style="--c:${c};left:${4 + i * 8.2}%;--h:${6 + ((i * 7) % 5) * 3}px"></i>`).join('');
let playing = null;
const top = (title, sub) => `<header class="hdr">
  <div class="hdr-text"><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>
  <button class="demo-pill${playing ? ' playing' : ''}${st.demoSeen ? '' : ' hint-pulse'}" data-act="demo" aria-label="${playing ? 'Pause the demo clock' : 'Demo controls: ' + clockLabel()}">${playing ? '<i class="pause"></i>' : SLIDERS}<span>${clockLabel()}</span>${playing ? '' : '<b class="chev" aria-hidden="true"></b>'}</button>
  <div class="drips" aria-hidden="true">${DRIPS}</div></header>`;

const mosaic = (n) => {
  const c = covered(n);
  let cells = '';
  for (let i = 0; i < n.qty; i++) cells += i < c ? `<i style="background:${PALETTE[(i * 7 + n.id.length) % PALETTE.length]}"></i>` : '<i></i>';
  return `<div class="mosaic" style="--n:${n.qty}" aria-hidden="true">${cells}</div>`;
};
function needCard(n, opts = {}) {
  const c = covered(n), full = c >= n.qty, mine = st.claims[n.id];
  let action;
  if (full) action = '<span class="tag whenever">Fully claimed</span>';
  else if (!signedIn()) action = '<button class="btn small ghost" data-act="signin">Sign in to claim</button>';
  else action = `<button class="btn small" data-act="claim" data-id="${n.id}">${mine ? 'Claim more' : 'Claim'}</button>`;
  return `<div class="card need${opts.inline ? ' inline' : ''}" data-act="need" data-id="${n.id}" role="button" tabindex="0" aria-label="Details for ${esc(n.title)}">
    <div class="need-top"><div><span class="tag ${n.urgency}">${URG[n.urgency]}</span>${n.posted ? '<span class="tag changed">New</span>' : ''}<h3 style="margin-top:6px">${esc(n.title)}</h3></div><span class="tag team">${n.team}</span></div>
    ${mosaic(n)}
    <div class="meta"><span><b>${c} of ${n.qty}</b> ${esc(n.unit)}</span><span>${dueLabel(n)}</span></div>
    ${mine ? `<p class="sub mine">You're bringing ${mine}</p>` : ''}
    <div class="need-actions">${action}</div></div>`;
}

// ---------- screens ----------
const screens = {
  home() {
    const { cur, next } = onNow();
    const crit = visibleNeeds().find((n) => n.urgency === 'critical' && covered(n) < n.qty);
    const r = raised();
    // Your stuff: only what this person has done.
    const mine = [];
    visibleNeeds().filter((n) => st.claims[n.id]).forEach((n) =>
      mine.push(`<a class="row" href="#needs"><span class="ico">✓</span><span><b>You're bringing ${st.claims[n.id]} ${esc(n.unit.split(',')[0])}</b><br><span class="sub">${esc(n.title)} · ${dueLabel(n)}</span></span></a>`));
    SETS.filter((s) => st.stars.includes(s.id) && !isCancelled(s) && setAbs(s) >= nowAbs()).sort((a, b) => setAbs(a) - setAbs(b)).slice(0, 2).forEach((s) =>
      mine.push(`<a class="row" href="#schedule"><span class="ico star-ico">★</span><span><b>${esc(s.name)}</b><br><span class="sub">${s.stage} · ${absLabel(setAbs(s))}${shiftOf(s) ? ' · moved' : ''}</span></span></a>`));
    st.orders.forEach((o) => mine.push(`<a class="row" href="#support"><span class="ico">▣</span><span><b>Order ${o.no}</b><br><span class="sub">${o.ship ? 'Shipping to you' : 'Pickup code ready at the merch booth'}</span></span></a>`));
    CREWS.filter((c) => st.joined[c.id] === 'pending').forEach((c) => mine.push(`<a class="row" href="#crews"><span class="ico">…</span><span><b>${c.name}</b><br><span class="sub">Waiting for the lead to approve</span></span></a>`));
    const inCrew = CREWS.some((c) => isMember(c.id));
    return `
    ${top('Freedom Fest', '17th annual · Labor Day weekend<br>Be kind to each other')}
    <div class="section-h"><h2>On now</h2><a href="#schedule">Full schedule</a></div>
    <div class="now-grid">
      <div class="card"><span class="kick">Playing</span>${cur ? `<span class="tag stage">${cur.stage}</span>
        <div class="act">${esc(cur.name)}</div><div class="sub">Until ${fmt(setEnd(cur))}</div>` : '<div class="act">Between sets</div>'}</div>
      <div class="card"><span class="kick">Up next</span>${next ? `<span class="tag stage">${next.stage}</span>
        <div class="act">${esc(next.name)}</div><div class="sub">${fmt(startOf(next))}${shiftOf(next) ? ' · moved' : ''}</div>` : '<div class="act">Done for today</div>'}</div>
    </div>
    ${mine.length ? `<div class="section-h"><h2>Your stuff</h2></div><div class="card list">${mine.join('')}</div>` : ''}
    ${crit ? `<div class="section-h"><h2>Needed now</h2><a href="#needs">All needs</a></div>${needCard(crit)}` : ''}
    <div class="section-h"><h2>Keep it free</h2></div>
    <a href="#support" class="card dark" style="display:block;text-decoration:none">
      <span class="raised">${money(r)}</span> <span class="sub">of ${money(FUND.goal)} goal</span>
      <div class="thermo"><span style="width:${pctOf(r)}%"></span></div>
      <div class="sub">${donors()} donors so far. Tap to give or get a shirt.</div></a>
    ${inCrew ? '' : `<div class="card"><h3>Pitch in with a crew</h3><p class="sub">Kitchen, parking, info booth, and more.</p>
      <div class="need-actions"><a class="btn small" href="#crews">Join a crew</a></div></div>`}`;
  },

  needs() {
    const F = { all: 'All', home: 'From home', quick: 'Under 30 min', soon: 'Next 2 hours' };
    const a = nowAbs();
    const vis = visibleNeeds();
    const list = vis.filter((n) => st.needFilter === 'all' || (st.needFilter === 'home' && n.home) || (st.needFilter === 'quick' && n.quick)
      || (st.needFilter === 'soon' && n.due != null && n.due - a <= 120));
    const open = vis.filter((n) => covered(n) < n.qty).length;
    return `${top('Needs board', `${dayOf(st.now.day).name} · ${open} open`)}
    <div class="chips" role="group" aria-label="Filter">${Object.entries(F).map(([k, l]) => `<button class="chip" data-act="nfilter" data-id="${k}" aria-pressed="${st.needFilter === k}">${l}</button>`).join('')}</div>
    ${isLead() ? '<button class="btn block yellow" data-act="post" style="margin:6px 0">+ Post a need for Kitchen</button>' : ''}
    ${list.length ? list.map((n) => needCard(n)).join('') : `<div class="card empty"><h3>Nothing here right now</h3><p class="sub">${st.needFilter === 'all' ? 'Every need is covered. Check back later.' : 'Try another filter.'}</p></div>`}
    <p class="hint">Tap a card for details. Needs drop off after their deadline.</p>`;
  },

  schedule() {
    const sel = st.scheduleDay || st.now.day;
    const chips = `<div class="chips" role="group" aria-label="Day">${DAYS.map((d) => `<button class="chip" data-act="day" data-id="${d.id}" aria-pressed="${d.id === sel}">${d.label}</button>`).join('')}
      <button class="chip" data-act="day" data-id="mine" aria-pressed="${sel === 'mine'}">★ Mine${st.stars.length ? ' ' + st.stars.length : ''}</button></div>`;
    const stage = st.role === 'stage' ? stagePanel() : '';
    if (sel === 'mine') {
      const mine = SETS.filter((s) => st.stars.includes(s.id)).sort((a, b) => setAbs(a) - setAbs(b));
      return `${top('My schedule', 'Sets you starred, with reminders')}${chips}${stage}
      ${mine.length ? DAYS.map((d) => {
        const ds = mine.filter((s) => s.day === d.id);
        return ds.length ? `<h3 class="day-h">${d.name}</h3>${ds.map((s) => setRow(s, true)).join('')}` : '';
      }).join('') : '<div class="card empty"><h3>No sets starred yet</h3><p class="sub">Tap ☆ on any set to add it here. You get a reminder 15 minutes before it starts.</p></div>'}`;
    }
    const day = dayOf(sel);
    const sets = SETS.filter((s) => s.day === day.id).sort((a, b) => startOf(a) - startOf(b));
    return `${top('Schedule', `${day.full} · Sunset ${day.sunset}`)}${chips}${stage}
    ${sets.map((s) => setRow(s)).join('')}
    <p class="hint">Tap a band for details.</p>`;
  },

  photos() {
    if (!signedIn()) return `${top('Photo album')}<div class="card"><h3>Sign in to see photos</h3><p class="sub">The album is for people at Freedom Fest. Photos never get public links.</p><div class="need-actions"><button class="btn small" data-act="signin">Sign in</button></div></div>`;
    const tiles = [['Sunset', '#F28B22,#D62B34'], ['Camp life', '#2DB36B,#1F3A27'], ['Kitchen', '#F9D84A,#F28B22'], ['Crew', '#2F63D6,#0B1328'], ['Shaman Stage', '#8F72F0,#2F63D6'], ['Kids’ area', '#45C4E8,#2DB36B'], ['Main Stage', '#D62B34,#8F72F0'], ['Night', '#141D3B,#8F72F0'], ['Sunday jam', '#F9D84A,#2DB36B']];
    return `${top('Photo album', '2,418 photos from 312 people')}
    <div class="chips"><button class="chip" aria-pressed="true">Crowd favorites</button><button class="chip">Friday</button><button class="chip">Saturday</button><button class="chip">Sunday</button><button class="chip">Monday</button></div>
    <div class="feat"><img src="assets/band.webp" alt="Singer in a white suit and hat raising a fist to a cheering night crowd"><span class="tag">Top photo</span><span class="hearts">♥ 214</span></div>
    <div class="grid">${tiles.map(([l, g]) => `<div class="tile" style="background:linear-gradient(135deg,${g})">${l}</div>`).join('')}</div>
    <p class="hint">Stand-in tiles. Real photos come from the crowd.</p>
    <button class="fab" data-act="upload" aria-label="Add photos">+</button>`;
  },

  chat(param) {
    const chans = channels();
    if (!chans.length) {
      return `${top('Crew chat')}<div class="card"><h3>Join a crew to chat</h3><p class="sub">Each crew has its own channel for coordinating on the day.</p><div class="need-actions"><a class="btn small" href="#crews">See crews</a></div></div>`;
    }
    const ch = chans.find((c) => c.id === param);
    if (!ch) {
      const group = (kind, label) => {
        const cs = chans.filter((c) => c.kind === kind);
        return cs.length ? `<h3 class="day-h">${label}</h3><div class="card list">${cs.map((c) => {
          const last = msgsFor(c.id).slice(-1)[0];
          return `<a class="row" href="#chat/${c.id}"><span class="av" style="background:${c.color}">${esc(c.name[0])}</span><span style="min-width:0"><b>${esc(c.name)}</b><br><span class="sub one">${last ? esc(last.who + ': ' + (last.text || 'Shared a need')) : ''}</span></span></a>`;
        }).join('')}</div>` : '';
      };
      return `${top('Chats', `${chans.length} channel${chans.length > 1 ? 's' : ''}`)}${group('crew', 'Your crews')}${group('leads', 'Leads')}${group('dm', 'Direct messages')}
      <p class="hint">Join more crews from Home.</p>`;
    }
    const msgs = msgsFor(ch.id);
    return `${top(esc(ch.name), ch.sub)}<a class="back" href="#chat">‹ Chats</a>
    ${ch.pinned ? `<div class="pinned"><b>Pinned:</b> ${esc(ch.pinned)}</div>` : ''}
    ${msgs.map((m) => `<div class="msg${m.me ? ' me' : ''}"><div class="av" style="background:${m.color}">${esc(m.who[0])}</div><div class="msg-body">
      <div class="who">${esc(m.who)}${m.role === 'lead' ? ', lead' : ''}</div><div class="bub">${m.text ? esc(m.text) : ''}
      ${m.need && allNeeds().find((n) => n.id === m.need) ? needCard(allNeeds().find((n) => n.id === m.need), { inline: true }) : ''}
      </div></div></div>`).join('')}
    <div style="height:64px"></div>
    <form class="composer" data-act="send" data-ch="${ch.id}"><button type="button" class="attach" data-act="share" data-ch="${ch.id}" aria-label="Share a need">+</button><input name="m" placeholder="Message ${esc(ch.name)}" autocomplete="off" aria-label="Message"><button class="btn small" type="submit">Send</button></form>`;
  },

  support() {
    const r = raised(), pct = pctOf(r);
    const n = cartCount();
    return `${top('Support', 'Freedom Fest is free to attend. Kept free by you.')}
    <div class="card dark"><span class="raised">${money(r)}</span> <span class="sub">raised of ${money(FUND.goal)}</span>
      <div class="thermo"><span style="width:${pct}%"></span></div>
      <div class="meta" style="color:#C9CEE6"><span>${pct}% · ${donors()} donors</span><span>Covers stages, power, porta-potties</span></div></div>
    <div class="section-h"><h2>Give</h2></div>
    <div class="card">
      <div class="amounts" role="group" aria-label="Amount">${AMOUNTS.map((a) => `<button class="chip" data-act="amount" data-id="${a}" aria-pressed="${st.amount === a}">$${a}</button>`).join('')}
        <label class="other"><span>$</span><input inputmode="numeric" pattern="[0-9]*" data-other aria-label="Other amount" placeholder="Other" value="${AMOUNTS.includes(st.amount) ? '' : st.amount}"></label></div>
      <div class="seg" style="--n:2">${[['venmo', 'Venmo'], ['gofundme', 'GoFundMe']].map(([k, l]) => `<button data-act="method" data-id="${k}" aria-pressed="${st.method === k}">${l}</button>`).join('')}</div>
      <button class="btn block yellow" data-act="give">Give $${st.amount} with ${st.method === 'venmo' ? 'Venmo' : 'GoFundMe'}</button>
      ${st.gifts.length ? `<p class="sub center">You've given ${money(st.gifts.reduce((a, g) => a + g.amount, 0))} this year. Thank you!</p>` : ''}</div>
    <div class="section-h"><h2>Merch</h2>${n ? `<button data-act="checkout">Cart (${n}) · ${money(cartTotal())}</button>` : ''}</div>
    ${PRODUCTS.map((p) => `<div class="card product">
      <div class="shirt">${p.id === 'tee' ? TEE_SVG : STICKER_SVG}
      <div><h3>${p.name}</h3><p class="sub">${money(p.price)} · ${p.blurb}</p></div></div>
      ${p.sizes ? `<div class="sizes" role="group" aria-label="Size">${p.sizes.map((s) => `<button class="chip" data-act="size" data-id="${s}" aria-pressed="false">${s}</button>`).join('')}</div>` : ''}
      <button class="btn block${p.sizes ? '' : ' ghost'}" data-act="add" data-id="${p.id}"${p.sizes ? ' disabled' : ''}>${p.sizes ? 'Pick a size' : 'Add to cart'}</button></div>`).join('')}
    ${n ? `<button class="btn block" data-act="checkout" style="margin-top:4px">Check out · ${money(cartTotal())}</button>` : ''}
    ${st.orders.length ? `<div class="section-h"><h2>Your orders</h2></div>${st.orders.slice().reverse().map((o) => `<div class="card order" data-act="order" data-id="${o.no}" role="button" tabindex="0">
      <div class="need-top"><div><h3>${o.no}</h3><p class="sub">${o.items.map((i) => `${i.qty} × ${PRODUCTS.find((p) => p.id === i.id).name}${i.size ? ' (' + i.size + ')' : ''}`).join(', ')}</p></div><b>${money(o.total)}</b></div>
      <p class="sub">${o.ship ? 'Shipping to your address' : 'Tap to show your pickup code'}</p></div>`).join('')}` : ''}
    <p class="hint">Demo numbers, prices, and links are placeholders.</p>`;
  },

  crews() {
    return `${top('Join a crew', 'Pick one or more. Leads approve some.')}<a class="back" href="#home">‹ Home</a>
    ${CREWS.map((c) => {
      const s = isMember(c.id) ? 'member' : st.joined[c.id];
      const btn = s === 'member' ? '<span class="tag whenever">Joined</span>' : s === 'pending' ? '<span class="tag changed">Requested</span>'
        : `<button class="btn small${c.open ? '' : ' ghost'}" data-act="join" data-id="${c.id}">${c.open ? 'Join' : 'Request'}</button>`;
      return `<div class="card crew"><div><h3>${c.name}</h3><p class="sub">${c.desc}</p></div>${btn}</div>`;
    }).join('')}
    <p class="hint">On the day, leads also hand out a QR code that joins their crew in one tap.</p>`;
  },
};

const TEE_SVG = '<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M30 4 L12 12 L2 32 L18 38 L22 30 L22 86 L78 86 L78 30 L82 38 L98 32 L88 12 L70 4 C66 14 34 14 30 4Z" fill="#0B1328"/><text x="50" y="48" text-anchor="middle" font-family="Lilita One" font-size="11" fill="#F9D84A">FREEDOM</text><text x="50" y="60" text-anchor="middle" font-family="Lilita One" font-size="11" fill="#F9D84A">FEST</text><text x="50" y="72" text-anchor="middle" font-family="Lilita One" font-size="8" fill="#8F72F0">2026</text></svg>';
const STICKER_SVG = '<svg viewBox="0 0 100 90" aria-hidden="true">' + PALETTE.slice(0, 5).map((c, i) => `<circle cx="${22 + i * 14}" cy="${30 + (i % 2) * 26}" r="17" fill="${c}" stroke="#fff" stroke-width="3"/>`).join('') + '</svg>';

function setRow(s, withDay) {
  const on = isOn(s), starred = st.stars.includes(s.id), moved = shiftOf(s), gone = isCancelled(s);
  return `<div class="card set${on ? ' on' : ''}${gone ? ' gone' : ''}"><div class="time">${fmt(startOf(s))}${moved ? `<s>${fmt(s.start)}</s>` : ''}</div>
    <button class="body" data-act="band" data-id="${s.id}"><span class="tag stage">${s.stage}</span>${on ? '<span class="tag now">On now</span>' : ''}${moved && !gone ? `<span class="tag changed">Moved ${moved} min</span>` : ''}${gone ? '<span class="tag critical">Cancelled</span>' : ''}<span class="name">${esc(s.name)}</span></button>
    ${starred && withDay ? `<button class="bell" data-act="remind" data-id="${s.id}" aria-pressed="${!!st.remind[s.id]}" aria-label="Reminder for ${esc(s.name)}">${st.remind[s.id] ? '🔔' : '🔕'}</button>` : ''}
    <button class="star" data-act="star" data-id="${s.id}" aria-pressed="${starred}" aria-label="${starred ? 'Unstar' : 'Star'} ${esc(s.name)}">${starred ? '★' : '☆'}</button></div>`;
}
function stagePanel() {
  const { cur, next } = onNow();
  const changed = st.shifts.length || Object.keys(st.cancelled).length;
  return `<div class="card stage-mgr"><span class="kick">Stage manager</span>
    <p class="sub">${cur ? `Playing: <b>${esc(cur.name)}</b>, until ${fmt(setEnd(cur))}` : 'Nobody on stage right now'}</p>
    ${next ? `<h3>Up next: ${esc(next.name)}</h3><p class="sub">${next.stage} · ${fmt(startOf(next))} · ${next.fans} people starred this set</p>
    <div class="sm-actions"><button class="btn small" data-act="delay" data-id="${next.id}">+15 min</button><button class="btn small ghost" data-act="cancelset" data-id="${next.id}">Cancel set</button></div>
    <label class="check"><input type="checkbox" data-act="cascade" ${st.cascade ? 'checked' : ''}> Shift later sets too</label>` : '<p class="sub">No more sets today.</p>'}
    ${changed ? '<button class="linkish" data-act="undoall">Undo all schedule changes</button>' : ''}</div>`;
}
function channels() {
  const out = CREWS.filter((c) => isMember(c.id)).map((c) => ({ id: c.id, kind: 'crew', name: c.name + ' crew', sub: `${c.members} members`, pinned: c.pinned, color: PALETTE[CREWS.indexOf(c)] }));
  if (isLead()) out.push({ id: 'leads', kind: 'leads', name: 'All leads', sub: 'Crew leads and coordinators', pinned: 'Coordinator on duty today: Lou.', color: '#0B1328' });
  if (isMember('kitchen')) out.push({ id: 'rosie', kind: 'dm', name: 'Rosie', sub: 'Kitchen lead', color: '#8F72F0' });
  return out;
}
const msgsFor = (id) => (SEED_MSGS[id] || []).concat(st.msgs[id] || []);

// ---------- tabs + routing ----------
const ICONS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  needs: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  schedule: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  photos: '<rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  support: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
};
const TABS = [['home', 'Home'], ['needs', 'Needs'], ['schedule', 'Schedule'], ['photos', 'Photos'], ['chat', 'Chat'], ['support', 'Support']];

function render() {
  const [want, param] = (location.hash.slice(1) || 'home').split('/');
  const name = screens[want] ? want : 'home';
  $('#main').innerHTML = screens[name](param);
  const tab = name === 'crews' ? 'home' : name;
  $('#tabs').innerHTML = TABS.map(([id, l]) => `<a href="#${id}"${id === tab ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>${l}${id === 'support' && cartCount() ? '<span class="dot"></span>' : ''}</a>`).join('');
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// ---------- demo clock ----------
const CLOCK_MIN = t(8), CLOCK_MAX = t(23);
function setClock(day, min) {
  const before = nowAbs();
  st.now = { day, min: Math.max(CLOCK_MIN, Math.min(CLOCK_MAX, min)) };
  save(); render(); checkReminders(before);
}
function checkReminders(before) {
  const a = nowAbs();
  if (a <= before) return;
  const due = SETS.find((s) => st.stars.includes(s.id) && st.remind[s.id] && !st.reminded[s.id] && !isCancelled(s) && setAbs(s) - 15 <= a && a < setAbs(s));
  if (due) { st.reminded[due.id] = true; save(); toast(`🔔 In ${setAbs(due) - a} min: ${due.name}, ${due.stage}`); }
}
function stopPlay() { clearInterval(playing); playing = null; render(); }
function play() {
  if (playing) return;
  playing = setInterval(() => {
    if (st.now.min + 15 > CLOCK_MAX) {
      const i = DAY_IDX[st.now.day];
      if (i === 3) return stopPlay();
      return setClock(DAYS[i + 1].id, t(10));
    }
    setClock(st.now.day, st.now.min + 15);
  }, 900);
  render();
}

// ---------- actions ----------
const actions = {
  demo() {
    if (playing) { stopPlay(); toast('Clock paused'); return; }
    if (!st.demoSeen) { st.demoSeen = true; save(); render(); }
    const roles = [['public', 'Public'], ['helper', 'Helper'], ['lead', 'Team lead'], ['stage', 'Stage mgr']];
    sheet(`<h2>Demo controls</h2>
      <h3 style="margin-top:12px">Clock: <span data-clock>${dayOf(st.now.day).name} ${fmt(st.now.min)}</span></h3>
      <div class="chips" role="group" aria-label="Day">${DAYS.map((d) => `<button class="chip" data-d="${d.id}" aria-pressed="${d.id === st.now.day}">${d.label}</button>`).join('')}</div>
      <input type="range" class="scrub" min="${CLOCK_MIN}" max="${CLOCK_MAX}" step="15" value="${st.now.min}" aria-label="Time of day">
      <div class="scrub-labels">${[[8, '8 AM'], [12, 'Noon'], [16, '4 PM'], [20, '8 PM'], [23, '11 PM']].map(([h, l]) => `<span style="left:${((h - 8) / 15) * 100}%">${l}</span>`).join('')}</div>
      <button class="btn block" data-play>▶ Play the day, 15 min a second</button>
      <h3 style="margin-top:16px">View as</h3>
      <div class="seg" style="--n:4">${roles.map(([r, l]) => `<button data-role="${r}" aria-pressed="${st.role === r}">${l}</button>`).join('')}</div>
      <button class="btn ghost block" data-reset>Reset demo</button>`, (el, close) => {
      const label = el.querySelector('[data-clock]'), range = el.querySelector('.scrub');
      const sync = () => { label.textContent = `${dayOf(st.now.day).name} ${fmt(st.now.min)}`; el.querySelectorAll('[data-d]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.d === st.now.day)); };
      range.oninput = () => { setClock(st.now.day, +range.value); sync(); };
      el.querySelectorAll('[data-d]').forEach((b) => b.onclick = () => { st.scheduleDay = null; setClock(b.dataset.d, +range.value); sync(); });
      el.querySelector('[data-play]').onclick = () => { close(); play(); toast('Tap the clock to pause'); };
      el.querySelectorAll('[data-role]').forEach((b) => b.onclick = () => {
        st.role = b.dataset.role;
        if (st.role === 'lead') st.joined.kitchen = 'member';
        if (st.role === 'stage') { st.scheduleDay = null; location.hash = '#schedule'; }
        save(); close(); render(); toast('Viewing as ' + b.textContent);
      });
      el.querySelector('[data-reset]').onclick = () => { st = fresh(); save(); close(); location.hash = '#home'; render(); toast('Demo reset'); };
    });
  },
  signin() { st.role = 'helper'; save(); render(); toast('Signed in as a Helper (demo)'); },

  // needs
  nfilter(b) { st.needFilter = b.dataset.id; save(); render(); },
  need(b) {
    const n = allNeeds().find((x) => x.id === b.dataset.id); if (!n) return;
    const c = covered(n), full = c >= n.qty, mine = st.claims[n.id];
    const who = claimants(n);
    sheet(`<div class="need-top"><div><span class="tag ${n.urgency}">${URG[n.urgency]}</span><span class="tag team">${n.team}</span><h2 style="margin-top:8px">${esc(n.title)}</h2></div></div>
      ${n.desc ? `<p>${esc(n.desc)}</p>` : ''}
      ${mosaic(n)}<div class="meta"><span><b>${c} of ${n.qty}</b> ${esc(n.unit)} covered</span><span>${full ? 'Fully claimed' : `${n.qty - c} still needed`}</span></div>
      <dl class="facts"><dt>Where</dt><dd>${esc(n.where)}</dd><dt>Needed</dt><dd>${dueLabel(n)}</dd>
        <dt>Claimed by</dt><dd>${who.length ? who.map(([w, q]) => `<span class="${w === 'You' ? 'mine' : ''}">${w} ${q}</span>`).join(', ') : 'Nobody yet'}</dd></dl>
      <div class="sheet-actions">
        ${!full && signedIn() ? `<button class="btn" data-go="claim">${mine ? 'Claim more' : 'Claim'}</button>` : ''}
        ${!signedIn() ? '<button class="btn" data-go="signin">Sign in to claim</button>' : ''}
        ${mine ? '<button class="btn ghost" data-go="unclaim">Unclaim</button>' : ''}
        ${isLead() && n.team === 'Kitchen' ? '<button class="btn ghost" data-go="fulfil">Mark fulfilled</button>' : ''}
      </div>`, (el, close) => {
      el.querySelectorAll('[data-go]').forEach((x) => x.onclick = () => { close(); actions[{ claim: 'claim', signin: 'signin', unclaim: 'unclaim', fulfil: 'fulfil' }[x.dataset.go]]({ dataset: { id: n.id } }); });
    });
  },
  claim(b) {
    const n = allNeeds().find((x) => x.id === b.dataset.id), left = n.qty - covered(n);
    if (left <= 0) return;
    let q = Math.min(left, n.qty >= 10 ? 5 : 1);
    sheet(`<h2>${esc(n.title)}</h2><p class="sub">${esc(n.where)} · ${dueLabel(n)}</p><h3 style="margin-top:14px;text-align:center">How many will you ${/^people/.test(n.unit) ? 'cover' : 'bring'}?</h3>
      <div class="stepper"><button data-d="-1" aria-label="Fewer">−</button><output>${q}</output><button data-d="1" aria-label="More">+</button></div>
      <p class="sub center">${left} still needed</p>
      <button class="btn block" data-go>Claim ${q}</button>`, (el, close) => {
      const out = el.querySelector('output'), go = el.querySelector('[data-go]');
      el.querySelectorAll('[data-d]').forEach((x) => x.onclick = () => { q = Math.max(1, Math.min(left, q + +x.dataset.d)); out.textContent = q; go.textContent = 'Claim ' + q; });
      go.onclick = () => { st.claims[n.id] = (st.claims[n.id] || 0) + q; save(); close(); render(); toast(`Thanks! The ${n.team} crew sees your claim.`); };
    });
  },
  unclaim(b) {
    const n = allNeeds().find((x) => x.id === b.dataset.id);
    const reasons = ['Plans changed', "Can't get it", 'Someone else has it'];
    sheet(`<h2>Unclaim ${esc(n.title.toLowerCase())}?</h2><p class="sub">The ${n.team} crew gets a notice that ${st.claims[n.id]} ${esc(n.unit.split(',')[0])} are open again.</p>
      <h3 style="margin-top:14px">Reason (optional)</h3>
      <div class="chips wrap">${reasons.map((r) => `<button class="chip" data-r aria-pressed="false">${r}</button>`).join('')}</div>
      <button class="btn block" data-go style="margin-top:10px">Unclaim</button><button class="btn ghost block" data-close style="margin-top:8px">Keep my claim</button>`, (el, close) => {
      el.querySelectorAll('[data-r]').forEach((x) => x.onclick = () => el.querySelectorAll('[data-r]').forEach((y) => y.setAttribute('aria-pressed', y === x)));
      el.querySelector('[data-go]').onclick = () => { delete st.claims[n.id]; save(); close(); render(); toast(`Unclaimed. The ${n.team} crew knows it's open.`); };
    });
  },
  fulfil(b) { const n = allNeeds().find((x) => x.id === b.dataset.id); st.closed[n.id] = true; save(); render(); toast(`${n.title} marked fulfilled. Thanks, everyone.`); },
  post() {
    sheet(`<h2>Post a need for Kitchen</h2>
      <p class="sub">Templates fill it in for you.</p>
      <div class="chips wrap">${TEMPLATES.map((tp, i) => `<button class="chip" data-tpl="${i}">${tp.label}</button>`).join('')}</div>
      <form class="form" data-form>
        <label>What's needed<input name="title" required placeholder="e.g. Bags of ice" autocomplete="off"></label>
        <div class="warn" hidden data-dup></div>
        <span class="lbl">Urgency</span>
        <div class="seg" style="--n:3">${Object.entries(URG).map(([k, l]) => `<button type="button" data-u="${k}" aria-pressed="${k === 'soon'}">${l}</button>`).join('')}</div>
        <div class="two"><label>How many<input name="qty" type="number" min="1" value="1" inputmode="numeric"></label><label>Of what<input name="unit" value="people" autocomplete="off"></label></div>
        <div class="two"><label>Needed by<select name="due"><option value="60">In 1 hour</option><option value="120" selected>In 2 hours</option><option value="240">In 4 hours</option><option value="">No deadline</option></select></label>
          <label>Where<select name="where">${PLACES.map((p) => `<option>${p}</option>`).join('')}</select></label></div>
        <label class="check"><input type="checkbox" name="home"> People can bring it from home</label>
        <label class="check"><input type="checkbox" name="quick"> Takes under 30 minutes</label>
        <button class="btn block" type="submit">Post need</button>
      </form>`, (el, close) => {
      const f = el.querySelector('[data-form]'); let urgency = 'soon', forceDup = false;
      const setU = (u) => { urgency = u; el.querySelectorAll('[data-u]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.u === u)); };
      el.querySelectorAll('[data-u]').forEach((x) => x.onclick = () => setU(x.dataset.u));
      el.querySelectorAll('[data-tpl]').forEach((x) => x.onclick = () => {
        const tp = TEMPLATES[+x.dataset.tpl];
        f.title.value = tp.title; f.qty.value = tp.qty; f.unit.value = tp.unit; f.where.value = tp.where; f.home.checked = !!tp.home; f.quick.checked = !!tp.quick; setU(tp.urgency);
        checkDup();
      });
      const dupBox = el.querySelector('[data-dup]');
      const dupOf = () => { const v = f.title.value.trim().toLowerCase(); return v.length > 2 && visibleNeeds().find((n) => covered(n) < n.qty && (n.title.toLowerCase().includes(v) || v.includes(n.title.toLowerCase()))); };
      const checkDup = () => { const d = dupOf(); forceDup = false; dupBox.hidden = !d; if (d) dupBox.innerHTML = `<b>${esc(d.title)}</b> is already open (${covered(d)} of ${d.qty}). Post anyway, or edit that need instead.`; };
      f.title.oninput = checkDup;
      f.onsubmit = (e) => {
        e.preventDefault();
        if (dupOf() && !forceDup) { forceDup = true; dupBox.innerHTML += ' <b>Tap Post need again to post a second one.</b>'; return; }
        const now = nowAbs();
        st.posted.push({ id: 'p' + Date.now(), title: f.title.value.trim(), team: 'Kitchen', urgency, qty: Math.max(1, +f.qty.value || 1), unit: f.unit.value.trim() || 'items', covered: 0,
          from: now, due: f.due.value ? now + +f.due.value : null, where: f.where.value, home: f.home.checked, quick: f.quick.checked, posted: true, desc: '' });
        st.needFilter = 'all'; save(); close(); location.hash = '#needs'; render(); toast('Posted. Kitchen crew and subscribers get a notice.');
      };
    });
  },

  // schedule
  day(b) { st.scheduleDay = b.dataset.id; save(); render(); },
  star(b) {
    const id = b.dataset.id, i = st.stars.indexOf(id);
    if (i >= 0) { st.stars.splice(i, 1); delete st.remind[id]; } else { st.stars.push(id); st.remind[id] = true; toast('Starred. Reminder set for 15 minutes before.'); }
    save(); render();
  },
  remind(b) { const id = b.dataset.id; st.remind[id] = !st.remind[id]; save(); render(); toast(st.remind[id] ? 'Reminder on' : 'Reminder off'); },
  band(b) {
    const s = SETS.find((x) => x.id === b.dataset.id), starred = st.stars.includes(s.id), d = dayOf(s.day);
    sheet(`<span class="tag stage">${s.stage}</span>${isOn(s) ? '<span class="tag now">On now</span>' : ''}${shiftOf(s) ? `<span class="tag changed">Moved ${shiftOf(s)} min</span>` : ''}${isCancelled(s) ? '<span class="tag critical">Cancelled</span>' : ''}
      <h2 style="margin-top:6px">${esc(s.name)}</h2><p class="sub">${d.name} · ${fmt(startOf(s))} to ${fmt(setEnd(s))}</p>
      <div class="band-photo" aria-hidden="true" style="background:linear-gradient(135deg,${PALETTE[s.id.length % 6]},${PALETTE[(+s.id.slice(1)) % 6]})"><span>Band photo</span></div>
      <p class="sub">The band's bio and photo arrive through their performer link, along with their OK to show them here.</p>
      <div class="chips wrap"><span class="chip ghosted">Website</span><span class="chip ghosted">Bandcamp</span><span class="chip ghosted">Instagram</span></div>
      <p class="sub">${s.fans + (starred ? 1 : 0)} people starred this set.</p>
      <div class="sheet-actions"><button class="btn${starred ? ' ghost' : ''}" data-go>${starred ? '★ Starred' : '☆ Star this set'}</button><a class="btn ghost" href="#photos" data-close>Photos from this set</a></div>`, (el, close) => {
      el.querySelector('[data-go]').onclick = () => { close(); actions.star({ dataset: { id: s.id } }); };
    });
  },
  delay(b) {
    const s = SETS.find((x) => x.id === b.dataset.id);
    st.shifts.push({ id: s.id, day: s.day, start: s.start, min: 15, cascade: st.cascade });
    const hit = SETS.filter((x) => x.day === s.day && !isCancelled(x) && (x.id === s.id || (st.cascade && x.start > s.start)));
    const fans = hit.reduce((a, x) => a + x.fans + (st.stars.includes(x.id) ? 1 : 0), 0);
    hit.forEach((x) => delete st.reminded[x.id]);
    save(); render();
    toast(`${s.name}${hit.length > 1 ? ` and ${hit.length - 1} later sets` : ''} moved 15 min. ${fans} people who starred them got a notice.`);
  },
  cancelset(b) {
    const s = SETS.find((x) => x.id === b.dataset.id);
    st.cancelled[s.id] = true; save(); render();
    toast(`${s.name} cancelled. ${s.fans + (st.stars.includes(s.id) ? 1 : 0)} people who starred it got a notice.`);
  },
  cascade(b) { st.cascade = b.checked; save(); },
  undoall() { st.shifts = []; st.cancelled = {}; save(); render(); toast('Schedule back to the original times'); },

  // photos
  upload() { toast('Uploading comes in the next pass'); },

  // chat
  share(b) {
    const list = visibleNeeds().filter((n) => covered(n) < n.qty);
    sheet(`<h2>Share a need</h2><p class="sub">It shows as a live card. Claims update it for everyone.</p>
      <div class="card list">${list.map((n) => `<button class="row" data-n="${n.id}"><span class="tag ${n.urgency}">${URG[n.urgency]}</span><span><b>${esc(n.title)}</b><br><span class="sub">${covered(n)} of ${n.qty} · ${dueLabel(n)}</span></span></button>`).join('')}</div>`, (el, close) => {
      el.querySelectorAll('[data-n]').forEach((x) => x.onclick = () => {
        (st.msgs[b.dataset.ch] = st.msgs[b.dataset.ch] || []).push({ who: 'You', color: '#2F63D6', text: '', need: x.dataset.n, me: true });
        save(); close(); render(); window.scrollTo(0, document.body.scrollHeight);
      });
    });
  },

  // support
  amount(b) { st.amount = +b.dataset.id; save(); render(); },
  method(b) { st.method = b.dataset.id; save(); render(); },
  give() {
    const amt = st.amount, venmo = st.method === 'venmo';
    if (!(amt > 0)) { toast('Pick an amount'); return; }
    sheet(`<h2>Give $${amt} with ${venmo ? 'Venmo' : 'GoFundMe'}</h2>
      <div class="handoff"><span class="ico big">${venmo ? 'V' : 'G'}</span><p>${venmo
        ? `In the live app this opens Venmo to the Freedom Fest account with <b>$${amt}</b> and the note “Freedom Fest 2026” filled in. You confirm the payment in Venmo.`
        : `In the live app this opens the Freedom Fest GoFundMe page. You enter <b>$${amt}</b> and pay there.`}</p></div>
      <button class="btn block yellow" data-go>Demo: I gave $${amt}</button><button class="btn ghost block" data-close style="margin-top:8px">Cancel</button>`, (el, close) => {
      el.querySelector('[data-go]').onclick = () => {
        const before = raised();
        st.gifts.push({ amount: amt, method: st.method }); save(); close(); render();
        thanks(before, raised());
      };
    });
  },
  size(b) {
    b.closest('.product').querySelectorAll('[data-act=size]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    const go = b.closest('.product').querySelector('[data-act=add]'); go.disabled = false; go.dataset.size = b.dataset.id; go.textContent = `Add size ${b.dataset.id} to cart`;
  },
  add(b) {
    const p = PRODUCTS.find((x) => x.id === b.dataset.id); if (p.sizes && !b.dataset.size) return;
    const line = st.cart.find((i) => i.id === p.id && i.size === b.dataset.size);
    if (line) line.qty++; else st.cart.push({ id: p.id, size: b.dataset.size || null, qty: 1 });
    save(); render(); toast(`Added ${p.name}${b.dataset.size ? ', size ' + b.dataset.size : ''}`);
  },
  checkout() {
    const draw = (el, close) => {
      if (!st.cart.length) { close(); render(); return; }
      const sub = cartTotal(), total = sub + (st.ship ? SHIP : 0);
      el.innerHTML = `<div class="grab"></div><h2>Your cart</h2>
        ${st.cart.map((i, k) => { const p = PRODUCTS.find((x) => x.id === i.id); return `<div class="line"><span><b>${p.name}</b>${i.size ? ` · ${i.size}` : ''}<br><span class="sub">${money(p.price)} each</span></span>
          <span class="qty"><button data-q="${k}" data-d="-1" aria-label="One fewer">−</button><output>${i.qty}</output><button data-q="${k}" data-d="1" aria-label="One more">+</button></span></div>`; }).join('')}
        <span class="lbl">Get it by</span>
        <div class="seg" style="--n:2"><button data-ship="0" aria-pressed="${!st.ship}">Pickup at the booth</button><button data-ship="1" aria-pressed="${st.ship}">Ship it (+${money(SHIP)})</button></div>
        ${st.ship ? '<form class="form"><label>Name<input autocomplete="name" placeholder="Name"></label><label>Address<input autocomplete="street-address" placeholder="Street, city, ZIP"></label></form>' : '<p class="sub">Show your pickup code at the merch booth any day of Freedom Fest.</p>'}
        <div class="line total"><span>Total</span><b>${money(total)}</b></div>
        <button class="btn block" data-pay>Pay ${money(total)}</button>
        <p class="sub center">Card, Apple Pay, or Google Pay through a hosted checkout. The app never sees card numbers.</p>`;
      el.querySelectorAll('[data-q]').forEach((x) => x.onclick = () => { const i = st.cart[+x.dataset.q]; i.qty += +x.dataset.d; if (i.qty < 1) st.cart.splice(+x.dataset.q, 1); save(); render(); draw(el, close); });
      el.querySelectorAll('[data-ship]').forEach((x) => x.onclick = () => { st.ship = x.dataset.ship === '1'; save(); draw(el, close); });
      el.querySelector('[data-pay]').onclick = () => {
        const o = { no: 'FF-' + (1047 + st.orders.length), items: st.cart, total, ship: st.ship };
        st.orders.push(o); st.cart = []; save(); close(); render();
        showOrder(o, true);
      };
    };
    sheet('', draw);
  },
  order(b) { showOrder(st.orders.find((o) => o.no === b.dataset.id)); },

  // crews
  join(b) {
    const c = CREWS.find((x) => x.id === b.dataset.id);
    if (st.role === 'public') st.role = 'helper';
    st.joined[c.id] = c.open ? 'member' : 'pending'; save(); render();
    toast(c.open ? `Welcome to the ${c.name} crew. Its chat is in Chat.` : `Request sent to the ${c.name} lead`);
  },
};

function thanks(before, after) {
  const g = st.gifts[st.gifts.length - 1];
  sheet(`<div class="thanks"><div class="heart-mosaic" aria-hidden="true">${'.XX.XX.XXXXXXXXXXXXXX.XXXXX...XXX.....X...'.split('').map((c, i) => c === 'X' ? `<i style="background:${PALETTE[i % 6]};animation-delay:${i * 25}ms"></i>` : '<i class="off"></i>').join('')}</div>
    <h2>Thank you!</h2><p>Your $${g.amount} helps keep Freedom Fest free. You're donor #${donors()}.</p>
    <div class="card dark"><span class="raised" data-count>${money(before)}</span> <span class="sub">of ${money(FUND.goal)}</span>
    <div class="thermo"><span data-bar style="width:${pctOf(before)}%"></span></div></div>
    <p class="sub">In the live app, organizers update the total as gifts come in.</p>
    <button class="btn block" data-close>Done</button></div>`, (el) => {
    const bar = el.querySelector('[data-bar]'), count = el.querySelector('[data-count]');
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = pctOf(after) + '%'; }));
    const t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / 1200); count.textContent = money(Math.round(before + (after - before) * k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
function showOrder(o, fresh) {
  sheet(`<h2>${fresh ? 'Order placed!' : 'Order ' + o.no}</h2>
    <p class="sub">${o.items.map((i) => `${i.qty} × ${PRODUCTS.find((p) => p.id === i.id).name}${i.size ? ' (' + i.size + ')' : ''}`).join(', ')} · ${money(o.total)}</p>
    ${o.ship ? '<div class="card"><h3>Shipping to you</h3><p class="sub">You get an email when it ships.</p></div>'
      : `<div class="card center"><span class="kick">Pickup code</span>${qr(+o.no.slice(3))}<h3>${o.no}</h3><p class="sub">Show this at the merch booth. Sizes can be swapped there if stock allows.</p></div>`}
    <p class="sub center">Thanks for helping keep Freedom Fest free.</p>
    <button class="btn block" data-close>Done</button>`);
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.tagName === 'FORM' || !actions[b.dataset.act]) return;
  if (b.dataset.act === 'cascade') { actions.cascade(b); return; }
  e.preventDefault(); actions[b.dataset.act](b);
});
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); }
});
document.addEventListener('change', (e) => {
  if (e.target.matches('[data-other]')) { const v = parseInt(e.target.value, 10); if (v > 0) { st.amount = v; save(); render(); } }
});
document.addEventListener('submit', (e) => {
  if (e.target.dataset.act !== 'send') return;
  e.preventDefault();
  const v = e.target.m.value.trim(); if (!v) return;
  const ch = e.target.dataset.ch;
  (st.msgs[ch] = st.msgs[ch] || []).push({ who: 'You', color: '#2F63D6', text: v, me: true }); save(); render();
  window.scrollTo(0, document.body.scrollHeight);
});

render();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
