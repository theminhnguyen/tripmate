// Simuliert die Multi-Trip-Merge-Logik aus index.html mit zwei Clients (Minh + Jane)
// Spiegelt die Funktionen aus index.html 1:1 — bei Änderungen dort auch hier aktualisieren!

function freshTrip(overrides) {
  const t = {
    id: 't' + Math.random().toString(36).slice(2, 10),
    name: 'Neue Reise', city: '', country: '', center: [51.5074, -0.1278],
    start: '', end: '',
    items: [], packlist: [], accommodations: [], events: [],
    _tombs: [], _metaUpdatedAt: 0
  };
  if (overrides) Object.assign(t, overrides);
  return t;
}
function makeState() {
  const t = freshTrip({ id: 't1', name: 'London', city: 'London, UK' });
  return { currentTripId: t.id, trips: { [t.id]: t }, _tripTombs: [] };
}

function ensureTripDefaults(t) {
  if (!t) return t;
  if (!Array.isArray(t.items)) t.items = [];
  if (!Array.isArray(t.packlist)) t.packlist = [];
  if (!Array.isArray(t.accommodations)) t.accommodations = [];
  if (!Array.isArray(t.events)) t.events = [];
  if (!Array.isArray(t._tombs)) t._tombs = [];
  if (typeof t._metaUpdatedAt !== 'number') t._metaUpdatedAt = 0;
  if (typeof t.country !== 'string') t.country = '';
  return t;
}

// ============ Aus index.html kopiert: mergeArrayById + mergeOneTrip + mergeRemoteState ============
function mergeArrayById(lArr, rArr, myTombs, prefix) {
  let changed = false;
  const localMap = new Map(lArr.map(function(x){ return [x.id, x]; }));
  (rArr || []).forEach(function(it){
    const local = localMap.get(it.id);
    if (!local) {
      if (!myTombs.has(prefix + ':' + it.id)) { lArr.push(it); changed = true; }
    } else {
      const rTs = it.updatedAt || it.createdAt || 0;
      const lTs = local.updatedAt || local.createdAt || 0;
      if (rTs > lTs) { Object.assign(local, it); changed = true; }
    }
  });
  const before = lArr.length;
  const filtered = lArr.filter(function(x){ return !myTombs.has(prefix + ':' + x.id); });
  if (filtered.length !== before) changed = true;
  return { changed, filtered };
}

function mergeOneTrip(lT, rT) {
  ensureTripDefaults(lT);
  let changed = false;
  const myTombs = new Set(lT._tombs);
  (rT._tombs || []).forEach(function(t){
    if (!myTombs.has(t)) { lT._tombs.push(t); myTombs.add(t); changed = true; }
  });
  const itemsRes = mergeArrayById(lT.items, rT.items || [], myTombs, 'i');
  lT.items = itemsRes.filtered; if (itemsRes.changed) changed = true;
  const packRes = mergeArrayById(lT.packlist, rT.packlist || [], myTombs, 'p');
  lT.packlist = packRes.filtered; if (packRes.changed) changed = true;
  const accRes = mergeArrayById(lT.accommodations, rT.accommodations || [], myTombs, 'a');
  lT.accommodations = accRes.filtered; if (accRes.changed) changed = true;
  const evRes = mergeArrayById(lT.events, rT.events || [], myTombs, 'e');
  lT.events = evRes.filtered; if (evRes.changed) changed = true;
  const rMeta = rT._metaUpdatedAt || 0;
  const lMeta = lT._metaUpdatedAt || 0;
  if (rMeta > lMeta) {
    ['name','city','country','center','start','end'].forEach(function(k){
      if (rT[k] !== undefined) lT[k] = rT[k];
    });
    lT._metaUpdatedAt = rMeta;
    changed = true;
  }
  return changed;
}

function mergeRemoteState(state, remote) {
  if (!remote || typeof remote !== 'object') return false;
  if (!remote.trips && (Array.isArray(remote.items) || remote.tripName)) {
    remote = {
      currentTripId: 't1',
      trips: { t1: {
        id: 't1', name: remote.tripName || 'Reise', city: remote.tripCity || '',
        center: remote.tripCenter || [51.5074, -0.1278],
        start: remote.tripStart || '', end: remote.tripEnd || '',
        items: remote.items || [], packlist: remote.packlist || [],
        accommodations: [], events: [],
        _tombs: remote._tombs || [], _metaUpdatedAt: remote._metaUpdatedAt || 0
      }},
      _tripTombs: []
    };
  }
  let changed = false;
  if (!state.trips) state.trips = {};
  if (!Array.isArray(state._tripTombs)) state._tripTombs = [];
  const myTripTombs = new Set(state._tripTombs);
  (remote._tripTombs || []).forEach(function(id){
    if (!myTripTombs.has(id)) { state._tripTombs.push(id); myTripTombs.add(id); changed = true; }
  });
  Object.entries(remote.trips || {}).forEach(function(entry){
    const id = entry[0], rT = entry[1];
    if (myTripTombs.has(id)) return;
    if (!state.trips[id]) {
      state.trips[id] = ensureTripDefaults(JSON.parse(JSON.stringify(rT)));
      changed = true;
    } else {
      if (mergeOneTrip(state.trips[id], rT)) changed = true;
    }
  });
  // Tombstoned trips lokal entfernen
  Object.keys(state.trips).forEach(function(id){
    if (myTripTombs.has(id)) { delete state.trips[id]; changed = true; }
  });
  if (!state.currentTripId || !state.trips[state.currentTripId]) {
    const first = Object.keys(state.trips)[0];
    if (first) state.currentTripId = first;
  }
  return changed;
}

// ============ Test-Framework ============
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log('  ✓ ' + desc); }
  else {
    fail++;
    console.log('  ✗ ' + desc);
    console.log('      expected:', JSON.stringify(expected));
    console.log('      actual:  ', JSON.stringify(actual));
  }
}
function section(name) { console.log('\n=== ' + name + ' ==='); }

// ============ Test 1: Basic merge items ============
section('1. Basic: Beide fügen Items hinzu');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.items.push({ id: 'i1', name: 'Big Ben', category: 'sight', createdAt: 100, updatedAt: 100 });
  jane.trips.t1.items.push({ id: 'i2', name: 'London Eye', category: 'sight', createdAt: 101, updatedAt: 101 });
  mergeRemoteState(minh, jane);
  mergeRemoteState(jane, minh);
  assert('Minh hat beide Items', minh.trips.t1.items.map(i => i.id).sort(), ['i1','i2']);
  assert('Jane hat beide Items', jane.trips.t1.items.map(i => i.id).sort(), ['i1','i2']);
}

// ============ Test 2: Tombstones (Löschen) ============
section('2. Tombstones: Gelöschtes Item bleibt gelöscht');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.items.push({ id: 'i1', name: 'Big Ben', category: 'sight', createdAt: 100, updatedAt: 100 });
  mergeRemoteState(jane, minh);
  // Minh löscht
  minh.trips.t1.items = minh.trips.t1.items.filter(i => i.id !== 'i1');
  minh.trips.t1._tombs.push('i:i1');
  mergeRemoteState(jane, minh);
  assert('Jane hat i1 nicht mehr', jane.trips.t1.items.length, 0);
  assert('Jane hat Tombstone', jane.trips.t1._tombs.includes('i:i1'), true);
  // Reverse sync: Minh bleibt leer
  mergeRemoteState(minh, jane);
  assert('Minh immer noch leer', minh.trips.t1.items.length, 0);
}

// ============ Test 3: Update später gewinnt ============
section('3. Update: Neuester updatedAt gewinnt');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.items.push({ id: 'i1', name: 'Big Ben', category: 'sight', createdAt: 100, updatedAt: 100 });
  mergeRemoteState(jane, minh);
  // Jane bearbeitet
  jane.trips.t1.items[0].name = 'Big Ben (UK)';
  jane.trips.t1.items[0].updatedAt = 200;
  mergeRemoteState(minh, jane);
  assert('Minh hat Update', minh.trips.t1.items[0].name, 'Big Ben (UK)');
}

// ============ Test 4: Meta-Daten mergen (city/country) ============
section('4. Meta: country wird synchronisiert');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.country = 'GB';
  minh.trips.t1.city = 'London, UK';
  minh.trips.t1._metaUpdatedAt = 500;
  mergeRemoteState(jane, minh);
  assert('Jane hat country', jane.trips.t1.country, 'GB');
  assert('Jane hat city', jane.trips.t1.city, 'London, UK');
}

// ============ Test 5: Accommodations merge ============
section('5. Unterkünfte: Sync zwischen Clients');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.accommodations.push({ id: 'a1', name: 'Hotel Central', address: 'Baker St 221B', createdAt: 100, updatedAt: 100 });
  jane.trips.t1.accommodations.push({ id: 'a2', name: 'Airbnb Soho', address: 'Soho Sq', createdAt: 101, updatedAt: 101 });
  mergeRemoteState(minh, jane);
  mergeRemoteState(jane, minh);
  assert('Minh hat beide Unterkünfte', minh.trips.t1.accommodations.map(a => a.id).sort(), ['a1','a2']);
  assert('Jane hat beide Unterkünfte', jane.trips.t1.accommodations.map(a => a.id).sort(), ['a1','a2']);
  // Tombstone
  jane.trips.t1.accommodations = jane.trips.t1.accommodations.filter(a => a.id !== 'a2');
  jane.trips.t1._tombs.push('a:a2');
  mergeRemoteState(minh, jane);
  assert('Minh nach Löschung nur a1', minh.trips.t1.accommodations.map(a => a.id), ['a1']);
}

// ============ Test 6: Events merge ============
section('6. Events: Flüge & Züge synchronisieren');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.events.push({ id: 'e1', type: 'flight', title: 'LH 400', date: '2026-05-01', createdAt: 100, updatedAt: 100 });
  jane.trips.t1.events.push({ id: 'e2', type: 'train', title: 'HBF → Airport', date: '2026-05-01', createdAt: 101, updatedAt: 101 });
  mergeRemoteState(minh, jane);
  assert('Minh hat beide Events', minh.trips.t1.events.map(e => e.id).sort(), ['e1','e2']);
  // Update
  jane.trips.t1.events.push(JSON.parse(JSON.stringify(minh.trips.t1.events.find(e => e.id === 'e1'))));
  const ev = jane.trips.t1.events.find(e => e.id === 'e1');
  ev.time = '10:30'; ev.updatedAt = 200;
  mergeRemoteState(minh, jane);
  assert('Minh hat Event-Update', minh.trips.t1.events.find(e => e.id === 'e1').time, '10:30');
}

// ============ Test 7: forKid bleibt beim Merge erhalten ============
section('7. Packlist forKid-Flag: Sync');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.packlist.push({ id: 'p1', name: 'Windeln', category: 'other', checked: false, forKid: true, createdAt: 100, updatedAt: 100 });
  mergeRemoteState(jane, minh);
  assert('Jane hat forKid', jane.trips.t1.packlist[0].forKid, true);
}

// ============ Test 8: Rating + done bleiben erhalten ============
section('8. done + rating: Sync');
{
  const minh = makeState(), jane = makeState();
  minh.trips.t1.items.push({ id: 'i1', name: 'Pub', category: 'food', done: true, rating: 5, comment: 'Sehr gut!', doneAt: 500, createdAt: 100, updatedAt: 100 });
  mergeRemoteState(jane, minh);
  const it = jane.trips.t1.items[0];
  assert('done übernommen', it.done, true);
  assert('rating übernommen', it.rating, 5);
  assert('comment übernommen', it.comment, 'Sehr gut!');
}

// ============ Test 9: Alter Trip ohne neue Felder (Backward-Compat) ============
section('9. Backward-Compat: Alte gespeicherte Reise bekommt Defaults');
{
  // Simuliert v2 Trip ohne accommodations/events/country
  const oldTrip = {
    id: 't_old', name: 'Alt-Reise', city: 'Paris', center: [48.85, 2.35], start: '', end: '',
    items: [{ id: 'i1', name: 'Eiffel', category: 'sight', createdAt: 100, updatedAt: 100 }],
    packlist: [{ id: 'p1', name: 'Pass', category: 'docs', checked: true, createdAt: 100, updatedAt: 100 }],
    _tombs: [], _metaUpdatedAt: 0
  };
  ensureTripDefaults(oldTrip);
  assert('accommodations leer, nicht undefined', Array.isArray(oldTrip.accommodations), true);
  assert('events leer, nicht undefined', Array.isArray(oldTrip.events), true);
  assert('country als leerer String', oldTrip.country, '');
  assert('items unverändert', oldTrip.items.length, 1);
  assert('packlist unverändert', oldTrip.packlist.length, 1);
  // Jetzt Remote-Merge mit neuerem Trip sollte nichts kaputt machen
  const newer = JSON.parse(JSON.stringify(oldTrip));
  newer.accommodations = [{ id: 'a1', name: 'Hotel', createdAt: 200, updatedAt: 200 }];
  mergeOneTrip(oldTrip, newer);
  assert('Nach Merge: Unterkunft eingefügt', oldTrip.accommodations.length, 1);
  assert('Alte items bleiben erhalten', oldTrip.items.length, 1);
}

// ============ Test 10: Trip-Tombstone löscht auf beiden Geräten ============
section('10. Trip-Löschung: Propagiert zu beiden');
{
  const minh = makeState(), jane = makeState();
  // Beide haben t1 und t2
  const t2 = freshTrip({ id: 't2', name: 'Paris', city: 'Paris' });
  minh.trips.t2 = JSON.parse(JSON.stringify(t2));
  jane.trips.t2 = JSON.parse(JSON.stringify(t2));
  // Minh löscht t2
  delete minh.trips.t2;
  minh._tripTombs.push('t2');
  mergeRemoteState(jane, minh);
  assert('Jane hat t2 nicht mehr', Object.keys(jane.trips).sort(), ['t1']);
}

// ============ Test 11: Mehrere Reisen parallel ============
section('11. Multi-Trip: Minh + Jane arbeiten an verschiedenen Reisen');
{
  const minh = makeState(), jane = makeState();
  // Beide haben 2 Reisen
  [minh, jane].forEach(s => {
    s.trips.tP = freshTrip({ id: 'tP', name: 'Paris', city: 'Paris' });
    s.trips.tR = freshTrip({ id: 'tR', name: 'Rom', city: 'Rom' });
  });
  minh.trips.tP.items.push({ id: 'iA', name: 'Eiffel', category: 'sight', createdAt: 100, updatedAt: 100 });
  jane.trips.tR.items.push({ id: 'iB', name: 'Kolosseum', category: 'sight', createdAt: 101, updatedAt: 101 });
  mergeRemoteState(minh, jane);
  mergeRemoteState(jane, minh);
  assert('Minh Paris: Eiffel da', minh.trips.tP.items.map(i => i.name), ['Eiffel']);
  assert('Jane Paris: Eiffel da', jane.trips.tP.items.map(i => i.name), ['Eiffel']);
  assert('Minh Rom: Kolosseum da', minh.trips.tR.items.map(i => i.name), ['Kolosseum']);
  assert('Alle 3 Reisen bei beiden', Object.keys(minh.trips).sort().join(','), 't1,tP,tR');
}

// ============ Test 12: Remote ohne trips-Feld (v1 Format) ============
section('12. Migration v1 → v2: Remote ohne trips-Feld');
{
  const minh = makeState();
  const v1Remote = {
    tripName: 'Barcelona', tripCity: 'Barcelona, ES',
    items: [{ id: 'iX', name: 'Sagrada', category: 'sight', createdAt: 100, updatedAt: 100 }],
    packlist: [], _tombs: [], _metaUpdatedAt: 500
  };
  mergeRemoteState(minh, v1Remote);
  assert('Minh hat neue Reise t1 (gemerged)', !!minh.trips.t1, true);
  assert('iX ist drin', minh.trips.t1.items.some(i => i.name === 'Sagrada'), true);
}

console.log('\n=============================');
console.log(`Total: ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
