// Pitch In prototype: front end only, seeded demo data, state kept in this browser.
(() => {
'use strict';

// ---------- demo clock: Monday, Sept 7, 2026, 2:30 PM ----------
const NOW = { day: 'mon', min: 14 * 60 + 30 };

// ---------- seed data ----------
const DAYS = [
  { id: 'fri', label: 'Fri', full: 'Friday, September 4', sunset: '7:43 PM' },
  { id: 'sat', label: 'Sat', full: 'Saturday, September 5', sunset: '7:41 PM' },
  { id: 'sun', label: 'Sun', full: 'Sunday, September 6', sunset: '7:39 PM' },
  { id: 'mon', label: 'Mon', full: 'Monday, September 7', sunset: '7:37 PM' },
];
const S = 'Shaman Stage', M = 'Main Stage';
const t = (h, m = 0) => h * 60 + m;
const SETS = [
  ['fri', S, t(16), 'Thirsty For Space'], ['fri', S, t(19), 'Aladdin Road ~ Steven Padilla'], ['fri', S, t(20, 30), 'Duffy Owens'],
  ['fri', M, t(16, 30), 'The Bill Davis Band'], ['fri', M, t(18), 'Rosy Rock & Roll ~ Featuring Cindy Avery'], ['fri', M, t(19, 30), 'Lowdown Gamblers'], ['fri', M, t(21), 'Mama Dirty Skirt'],
  ['sat', M, t(11), 'Breakfast with The Dyrbs'], ['sat', M, t(13), 'The Pourboys'], ['sat', M, t(15), 'Donna Ray Band'], ['sat', M, t(17), 'Howard Levy Duo'], ['sat', M, t(19), 'Unbound with Friends'], ['sat', M, t(21), "Who's Your Daddy"],
  ['sat', S, t(12), '2Old2B Famous'], ['sat', S, t(14), 'Culler Seelye & Company'], ['sat', S, t(16), 'Delta Promenade'], ['sat', S, t(18), 'Dangerous Curves'], ['sat', S, t(20), 'The Go4s'],
  ['sun', S, t(11), 'Tom & Jill'], ['sun', S, t(13), 'Denny & The Jeffs'], ['sun', S, t(15), 'Coyote Creek'], ['sun', S, t(17), 'Midnight Café ~ Greg Murat'],
  ['sun', M, t(12), 'Pitman-Sutton Band'], ['sun', M, t(14), 'McPage & Powell'], ['sun', M, t(16), 'Bobby Holland & The Breadline'], ['sun', M, t(18), "Vaughn Jensen's All-Star Jam"], ['sun', M, t(19), 'Fire Drill / Harmonica Hell'], ['sun', M, t(19, 45), 'Nick Mardon Trio'], ['sun', M, t(21), 'The Davanos'],
  ['mon', S, t(11), 'Tim Ogard'], ['mon', S, t(13), 'The McCarters'], ['mon', S, t(15), 'Nicholas Russell'], ['mon', S, t(17), 'Eric Kosarot & Jonah Roth'], ['mon', S, t(19), 'Plumb Tuckered'],
  ['mon', M, t(12), 'The Bel Reds'], ['mon', M, t(14), 'Carissa Ashley Band'], ['mon', M, t(16), 'Dale Spalding Band'], ['mon', M, t(18), 'Ron Hendee and Friends'], ['mon', M, t(20), "NoMomma ~ Marc Lagen's Tribute to Sheri Roberts Greimes ~ Featuring Stacy Jones"],
].map(([day, stage, start, name], i) => ({ id: 's' + i, day, stage, start, name }));

const NEEDS = [
  { id: 'ice', title: 'Bags of ice', team: 'Kitchen', urgency: 'critical', qty: 20, unit: 'bags', covered: 5, when: 'By 3:00 PM', where: 'Kitchen cooler' },
  { id: 'cones', title: 'Traffic cones', team: 'Parking', urgency: 'critical', qty: 12, unit: 'cones', covered: 8, when: 'By 4:00 PM', where: 'Gate' },
  { id: 'dish', title: 'Dish crew', team: 'Kitchen', urgency: 'soon', qty: 4, unit: 'people, 2 hours', covered: 2, when: '6:00 PM', where: 'Kitchen' },
  { id: 'cords', title: 'Extension cords, 50 ft', team: 'Lights and sound', urgency: 'whenever', qty: 3, unit: 'cords', covered: 1, when: '', where: 'Main Stage' },
];
const URG = { critical: 'Critical', soon: 'Needed soon', whenever: 'Whenever' };

const CREWS = [
  { id: 'kitchen', name: 'Kitchen', desc: 'Cooking, serving, dishes', open: true },
  { id: 'sound', name: 'Lights and sound', desc: 'Stage power, mics, changeovers', open: false },
  { id: 'parking', name: 'Parking', desc: 'Directing cars at the gate and lots', open: true },
  { id: 'security', name: 'Security', desc: 'Overnight walks, first contact for help', open: false },
  { id: 'info', name: 'Info booth', desc: 'Answering questions, lost and found', open: true },
  { id: 'photo', name: 'Photo team', desc: 'Curating the Freedom Fest album', open: true },
];

const FUND = { raised: 8420, goal: 15000, donors: 163 }; // placeholder numbers
const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const PALETTE = ['#2DB36B', '#2F63D6', '#F9D84A', '#F28B22', '#D62B34', '#8F72F0'];

const SEED_MSGS = [
  { who: 'Rosie', role: 'lead', color: '#8F72F0', text: "Burgers are moving fast. We'll be out of buns by 6." },
  { who: 'Dee', color: '#2DB36B', text: 'Claimed 6 packs. Store run in 10.' },
  { who: 'Big Mike', color: '#F28B22', text: 'Block ice works too. Leave it at the cooler, not by the grill.' },
];

// ---------- state (persists in this browser; Reset demo clears it) ----------
const KEY = 'pitchin-demo-v1';
const fresh = () => ({ role: 'helper', stars: [], claims: {}, msgs: [], joined: {}, shirt: null, scheduleDay: NOW.day });
let st = fresh();
try { st = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (min) => { const h = Math.floor(min / 60), m = min % 60, h12 = ((h + 11) % 12) + 1; return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const money = (n) => '$' + n.toLocaleString('en-US');
const covered = (n) => Math.min(n.qty, n.covered + (st.claims[n.id] || 0));
const signedIn = () => st.role !== 'public';

function toast(msg) {
  document.querySelectorAll('.toast').forEach((x) => x.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}
function sheet(html, onMount) {
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  scrim.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  scrim.addEventListener('click', (e) => { if (e.target === scrim) scrim.remove(); });
  document.body.appendChild(scrim); onMount && onMount(scrim.firstElementChild, () => scrim.remove());
}

const mosaic = (n) => {
  const c = covered(n);
  let cells = '';
  for (let i = 0; i < n.qty; i++) cells += i < c ? `<i style="background:${PALETTE[(i * 7 + n.id.length) % PALETTE.length]}"></i>` : '<i></i>';
  return `<div class="mosaic" style="--n:${n.qty}" aria-hidden="true">${cells}</div>`;
};
// Page header: navy band with jacket-color paint drips.
let route = 'home';
const DRIPS = PALETTE.concat(PALETTE).map((c, i) => `<i style="--c:${c};left:${4 + i * 8.2}%;--h:${6 + ((i * 7) % 5) * 3}px"></i>`).join('');
const top = (title, sub) => `<header class="hdr">
  <div class="hdr-text"><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>
  <button class="demo-pill" data-act="demo"><i></i>Mon 2:30 PM</button>
  <div class="drips" aria-hidden="true">${DRIPS}</div></header>`;

// One band plays at a time: the stages alternate, so a set runs until the next set starts on either stage.
const LAST_SET_MIN = 120; // assumed length of the day's final set
const setEnd = (s) => {
  const later = SETS.filter((x) => x.day === s.day && x.start > s.start).map((x) => x.start);
  return later.length ? Math.min(...later) : s.start + LAST_SET_MIN;
};
function onNow() {
  const list = SETS.filter((s) => s.day === NOW.day).sort((a, b) => a.start - b.start);
  const cur = list.find((s) => s.start <= NOW.min && NOW.min < setEnd(s)) || null;
  const next = list.find((s) => s.start > NOW.min) || null;
  return { cur, next };
}
const isOn = (s) => s.day === NOW.day && onNow().cur === s;

function needCard(n) {
  const c = covered(n), full = c >= n.qty, mine = st.claims[n.id];
  let action;
  if (full) action = '<span class="tag whenever">Fully claimed</span>';
  else if (!signedIn()) action = '<button class="btn small ghost" data-act="signin">Sign in to claim</button>';
  else action = `<button class="btn small" data-act="claim" data-id="${n.id}">${mine ? 'Claim more' : 'Claim'}</button>`;
  return `<div class="card">
    <div class="need-top"><div><span class="tag ${n.urgency}">${URG[n.urgency]}</span><h3 style="margin-top:6px">${n.title}</h3></div><span class="tag team">${n.team}</span></div>
    ${mosaic(n)}
    <div class="meta"><span><b>${c} of ${n.qty}</b> ${n.unit}</span><span>${n.when || n.where}</span></div>
    ${mine ? `<p class="sub" style="color:var(--green);font-weight:700">You're bringing ${mine}</p>` : ''}
    <div class="need-actions">${action}</div></div>`;
}

// ---------- screens ----------
const screens = {
  home() {
    const { cur, next } = onNow();
    const crit = NEEDS.find((n) => n.urgency === 'critical' && covered(n) < n.qty);
    const pct = Math.round((FUND.raised / FUND.goal) * 100);
    return `
    ${top('Freedom Fest', '17th annual · Labor Day weekend<br>Be kind to each other')}
    <div class="section-h"><h2>On now</h2><a href="#schedule">Full schedule</a></div>
    <div class="now-grid">
      <div class="card"><span class="kick">Playing</span>${cur ? `<span class="tag stage">${cur.stage}</span>
        <div class="act">${esc(cur.name)}</div><div class="sub">Until ${fmt(setEnd(cur))}</div>` : '<div class="act">Between sets</div>'}</div>
      <div class="card"><span class="kick">Up next</span>${next ? `<span class="tag stage">${next.stage}</span>
        <div class="act">${esc(next.name)}</div><div class="sub">${fmt(next.start)}</div>` : '<div class="act">Done for today</div>'}</div>
    </div>
    ${crit ? `<div class="section-h"><h2>Needed now</h2><a href="#needs">All needs</a></div>${needCard(crit)}` : ''}
    <div class="section-h"><h2>Keep it free</h2></div>
    <a href="#support" class="card dark" style="display:block;text-decoration:none">
      <span class="raised">${money(FUND.raised)}</span> <span class="sub">of ${money(FUND.goal)} goal</span>
      <div class="thermo"><span style="width:${pct}%"></span></div>
      <div class="sub">${FUND.donors} donors so far. Tap to give or get a shirt.</div></a>
    <div class="card"><h3>Pitch in with a crew</h3><p class="sub">Kitchen, parking, info booth, and more.</p>
      <div class="need-actions"><a class="btn small" href="#crews">Join a crew</a></div></div>`;
  },

  needs() {
    const lead = st.role === 'lead';
    return `${top('Needs board', `Monday · ${NEEDS.filter((n) => covered(n) < n.qty).length} open`)}
    <div class="chips"><button class="chip" aria-pressed="true">All</button><button class="chip">From home</button><button class="chip">Under 30 min</button><button class="chip">Next 2 hours</button></div>
    ${lead ? '<button class="btn block yellow" data-act="post" style="margin:6px 0">+ Post a need for Kitchen</button>' : ''}
    ${NEEDS.map(needCard).join('')}`;
  },

  schedule() {
    const day = DAYS.find((d) => d.id === st.scheduleDay);
    const sets = SETS.filter((s) => s.day === day.id).sort((a, b) => a.start - b.start || a.stage.localeCompare(b.stage));
    return `${top('Schedule', `${day.full} · Sunset ${day.sunset}`)}
    <div class="chips" role="group" aria-label="Day">${DAYS.map((d) => `<button class="chip" data-act="day" data-id="${d.id}" aria-pressed="${d.id === day.id}">${d.label}</button>`).join('')}</div>
    ${sets.map((s) => {
      const on = isOn(s), starred = st.stars.includes(s.id);
      return `<div class="card set${on ? ' on' : ''}"><div class="time">${fmt(s.start)}</div>
        <div class="body"><span class="tag stage">${s.stage}</span>${on ? '<span class="tag now">On now</span>' : ''}<div class="name">${esc(s.name)}</div></div>
        <button class="star" data-act="star" data-id="${s.id}" aria-pressed="${starred}" aria-label="${starred ? 'Unstar' : 'Star'} ${esc(s.name)}">${starred ? '★' : '☆'}</button></div>`;
    }).join('')}`;
  },

  photos() {
    if (!signedIn()) return `${top('Freedom Fest album')}<div class="card"><h3>Sign in to see photos</h3><p class="sub">The album is for people at Freedom Fest. Photos never get public links.</p><div class="need-actions"><button class="btn small" data-act="signin">Sign in</button></div></div>`;
    const tiles = [['Sunset', '#F28B22,#D62B34'], ['Camp life', '#2DB36B,#1F3A27'], ['Kitchen', '#F9D84A,#F28B22'], ['Crew', '#2F63D6,#0B1328'], ['Shaman Stage', '#8F72F0,#2F63D6'], ['Kids’ area', '#45C4E8,#2DB36B'], ['Main Stage', '#D62B34,#8F72F0'], ['Night', '#141D3B,#8F72F0'], ['Sunday jam', '#F9D84A,#2DB36B']];
    return `${top('Freedom Fest album', '2,418 photos from 312 people')}
    <div class="chips"><button class="chip" aria-pressed="true">Crowd favorites</button><button class="chip">Friday</button><button class="chip">Saturday</button><button class="chip">Sunday</button><button class="chip">Monday</button></div>
    <div class="feat"><img src="assets/band.webp" alt="Singer in a white suit and hat raising a fist to a cheering night crowd"><span class="tag">Top photo</span><span class="hearts">♥ 214</span></div>
    <div class="grid">${tiles.map(([l, g]) => `<div class="tile" style="background:linear-gradient(135deg,${g})">${l}</div>`).join('')}</div>
    <p class="hint">Stand-in tiles. Real photos come from the crowd.</p>
    <button class="fab" data-act="upload" aria-label="Add photos">+</button>`;
  },

  chat() {
    if (!signedIn() || !Object.keys(st.joined).length && st.role === 'helper') {
      return `${top('Crew chat')}<div class="card"><h3>Join a crew to chat</h3><p class="sub">Each crew has its own channel for coordinating on the day.</p><div class="need-actions"><a class="btn small" href="#crews">See crews</a></div></div>`;
    }
    const ice = NEEDS[0], c = covered(ice);
    const msgs = SEED_MSGS.concat(st.msgs);
    return `${top('Kitchen crew', '18 members')}
    <div class="pinned"><b>Pinned:</b> Radio channel 3. Spare propane is behind the serving tent.</div>
    ${msgs.map((m, i) => `<div class="msg${m.me ? ' me' : ''}"><div class="av" style="background:${m.color}">${esc(m.who[0])}</div><div style="min-width:0">
      <div class="who">${esc(m.who)}${m.role === 'lead' ? ', lead' : ''}</div><div class="bub">${esc(m.text)}
      ${i === 0 ? `<div class="card" style="margin:8px 0 2px"><span class="tag ${ice.urgency}">${URG[ice.urgency]}</span><h3 style="margin-top:4px">${ice.title}</h3>${mosaic(ice)}<div class="meta"><span><b>${c} of ${ice.qty}</b> ${ice.unit}</span><a href="#needs">Open</a></div></div>` : ''}
      </div></div></div>`).join('')}
    <div style="height:64px"></div>
    <form class="composer" data-act="send"><input name="m" placeholder="Message Kitchen crew" autocomplete="off" aria-label="Message"><button class="btn small" type="submit">Send</button></form>`;
  },

  support() {
    const pct = Math.round((FUND.raised / FUND.goal) * 100);
    return `${top('Support', 'Freedom Fest is free to attend. Kept free by you.')}
    <div class="card dark"><span class="raised">${money(FUND.raised)}</span> <span class="sub">raised of ${money(FUND.goal)}</span>
      <div class="thermo"><span style="width:${pct}%"></span></div>
      <div class="meta" style="color:#C9CEE6"><span>${pct}% · ${FUND.donors} donors</span><span>Covers stages, power, porta-potties</span></div></div>
    <div class="pay">
      <button class="btn yellow" data-act="link" data-name="GoFundMe">Give on GoFundMe</button>
      <button class="btn ghost" data-act="link" data-name="Venmo">Venmo</button></div>
    <div class="section-h"><h2>2026 T-shirt</h2></div>
    <div class="card">${st.shirt ? `
      <h3>Reserved: size ${st.shirt}</h3><p class="sub">Show this at the merch booth to pay and pick it up.</p>
      <div class="qr" aria-hidden="true">${Array.from({ length: 121 }, (_, i) => ((i * 37 + (i >> 3) * 11) % 5 < 2 ? '<b></b>' : '<i></i>')).join('')}</div>
      <button class="btn small ghost block" data-act="unshirt">Cancel reservation</button>` : `
      <div class="shirt"><svg viewBox="0 0 100 90" aria-hidden="true"><path d="M30 4 L12 12 L2 32 L18 38 L22 30 L22 86 L78 86 L78 30 L82 38 L98 32 L88 12 L70 4 C66 14 34 14 30 4Z" fill="#0B1328"/><text x="50" y="48" text-anchor="middle" font-family="Lilita One" font-size="11" fill="#F9D84A">FREEDOM</text><text x="50" y="60" text-anchor="middle" font-family="Lilita One" font-size="11" fill="#F9D84A">FEST</text><text x="50" y="72" text-anchor="middle" font-family="Lilita One" font-size="8" fill="#8F72F0">2026</text></svg>
      <div><h3>Freedom Fest 2026 tee</h3><p class="sub">$25 · Black, flyer art on the front. Pick up at the merch booth.</p></div></div>
      <div class="sizes" role="group" aria-label="Size">${SIZES.map((s) => `<button class="chip" data-act="size" data-id="${s}" aria-pressed="false">${s}</button>`).join('')}</div>
      <button class="btn block" data-act="shirt" disabled>Pick a size</button>`}</div>
    <p class="hint">Demo numbers, price, and links are placeholders.</p>`;
  },

  crews() {
    return `${top('Join a crew', 'Pick one or more. Leads approve some.')}<a class="back" href="#home">‹ Home</a>
    ${CREWS.map((c) => {
      const s = st.joined[c.id];
      const btn = s === 'member' ? '<span class="tag whenever">Joined</span>' : s === 'pending' ? '<span class="tag changed">Requested</span>'
        : `<button class="btn small${c.open ? '' : ' ghost'}" data-act="join" data-id="${c.id}">${c.open ? 'Join' : 'Request'}</button>`;
      return `<div class="card crew"><div><h3>${c.name}</h3><p class="sub">${c.desc}</p></div>${btn}</div>`;
    }).join('')}
    <p class="hint">On the day, leads also hand out a QR code that joins their crew in one tap.</p>`;
  },
};

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
  const want = (location.hash.slice(1) || 'home');
  const name = screens[want] ? want : 'home';
  route = name;
  $('#main').innerHTML = screens[name]();
  const tab = name === 'crews' ? 'home' : name;
  $('#tabs').innerHTML = TABS.map(([id, l]) => `<a href="#${id}"${id === tab ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>${l}</a>`).join('');
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// ---------- actions ----------
const actions = {
  demo() {
    sheet(`<h2>Demo controls</h2><p class="sub">Clock is frozen at Monday, Sept 7, 2:30 PM.</p>
      <h3 style="margin-top:14px">View as</h3>
      <div class="seg">${[['public', 'Public'], ['helper', 'Helper'], ['lead', 'Team lead']].map(([r, l]) => `<button data-role="${r}" aria-pressed="${st.role === r}">${l}</button>`).join('')}</div>
      <button class="btn ghost block" data-reset>Reset demo</button>`, (el, close) => {
      el.querySelectorAll('[data-role]').forEach((b) => b.onclick = () => {
        st.role = b.dataset.role;
        if (st.role === 'lead') st.joined.kitchen = 'member';
        save(); close(); render(); toast('Viewing as ' + b.textContent);
      });
      el.querySelector('[data-reset]').onclick = () => { st = fresh(); save(); close(); location.hash = '#home'; render(); toast('Demo reset'); };
    });
  },
  signin() { st.role = 'helper'; save(); render(); toast('Signed in as a Helper (demo)'); },
  claim(b) {
    const n = NEEDS.find((x) => x.id === b.dataset.id), left = n.qty - covered(n);
    let q = Math.min(left, n.id === 'ice' ? 5 : 1);
    sheet(`<h2>${n.title}</h2><p class="sub">${n.where} · ${n.when || 'Any time'}</p><h3 style="margin-top:14px;text-align:center">How many will you ${n.unit.startsWith('people') ? 'cover' : 'bring'}?</h3>
      <div class="stepper"><button data-d="-1" aria-label="Fewer">−</button><output>${q}</output><button data-d="1" aria-label="More">+</button></div>
      <button class="btn block" data-go>Claim ${q}</button>`, (el, close) => {
      const out = el.querySelector('output'), go = el.querySelector('[data-go]');
      el.querySelectorAll('[data-d]').forEach((x) => x.onclick = () => { q = Math.max(1, Math.min(left, q + +x.dataset.d)); out.textContent = q; go.textContent = 'Claim ' + q; });
      go.onclick = () => { st.claims[n.id] = (st.claims[n.id] || 0) + q; save(); close(); render(); toast(`Thanks! ${n.team} crew sees your claim.`); };
    });
  },
  post() { toast('Posting needs comes in the next pass'); },
  day(b) { st.scheduleDay = b.dataset.id; save(); render(); },
  star(b) {
    const id = b.dataset.id, i = st.stars.indexOf(id);
    if (i >= 0) st.stars.splice(i, 1); else st.stars.push(id);
    save(); render();
  },
  upload() { toast('Uploading comes in the next pass'); },
  link(b) { toast(b.dataset.name + ' link is a placeholder for now'); },
  size(b) {
    document.querySelectorAll('[data-act=size]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    const go = $('[data-act=shirt]'); go.disabled = false; go.dataset.size = b.dataset.id; go.textContent = `Reserve size ${b.dataset.id} for pickup`;
  },
  shirt(b) { if (!b.dataset.size) return; st.shirt = b.dataset.size; save(); render(); toast('Shirt reserved'); },
  unshirt() { st.shirt = null; save(); render(); },
  join(b) {
    const c = CREWS.find((x) => x.id === b.dataset.id);
    if (st.role === 'public') st.role = 'helper';
    st.joined[c.id] = c.open ? 'member' : 'pending'; save(); render();
    toast(c.open ? `Welcome to the ${c.name} crew` : `Request sent to the ${c.name} lead`);
  },
};

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b && b.tagName !== 'FORM' && actions[b.dataset.act]) { e.preventDefault(); actions[b.dataset.act](b); }
});
document.addEventListener('submit', (e) => {
  if (e.target.dataset.act !== 'send') return;
  e.preventDefault();
  const v = e.target.m.value.trim(); if (!v) return;
  st.msgs.push({ who: 'You', color: '#2F63D6', text: v, me: true }); save(); render();
  window.scrollTo(0, document.body.scrollHeight);
});

render();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
