// Gestione delle notifiche push, incluso nel service worker generato dalla PWA.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  const title = data.title || 'SCAUTOTRASPORTI';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: data.tag,
    renotify: !!data.tag,
    data: { url: data.url || './' },
  }));
});

// Tocco sulla notifica: porta in primo piano l'app (o la apre) sulla schermata giusta
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data && event.notification.data.url || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.startsWith(self.registration.scope)) { await c.focus(); return c.navigate(target); }
    }
    return self.clients.openWindow(target);
  })());
});
