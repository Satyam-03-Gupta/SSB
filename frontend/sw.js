self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New order received!',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [100, 50, 100]
  };
  
  event.waitUntil(
    self.registration.showNotification('SSB Biryani - New Order!', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/admin')
  );
});