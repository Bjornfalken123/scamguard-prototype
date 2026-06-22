const $ = (id) => document.getElementById(id);

async function analyze() {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: $('text').value })
  });
  $('result').textContent = JSON.stringify(await res.json(), null, 2);
}

async function refreshEvents() {
  const res = await fetch('/api/events');
  const events = await res.json();
  $('events').innerHTML = events.length ? events.map(e => `
    <div class="event">
      <span class="badge">${e.type || 'event'}</span>
      <p><strong>${e.createdAt || ''}</strong></p>
      <pre>${JSON.stringify(e, null, 2)}</pre>
    </div>
  `).join('') : '<p>Inga events ännu.</p>';
}

$('analyze').addEventListener('click', analyze);
$('refresh').addEventListener('click', refreshEvents);
refreshEvents();
