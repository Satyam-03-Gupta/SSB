class NotificationService {
  constructor() {
    this.audio = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audio = new Audio('/assets/notification.mp3');
      this.audio.volume = 0.8;
      this.audio.preload = 'auto';
      console.log('✅ Audio initialized');
    } catch (error) {
      console.log('Audio init error:', error);
    }
  }

  async playSound() {
    console.log('🔊 Playing notification sound...');
    
    try {
      // Create fresh audio instance each time
      const audio = new Audio('/assets/notification.mp3');
      audio.volume = 0.8;
      audio.currentTime = 0;
      await audio.play();
      console.log('✅ Sound played successfully');
    } catch (error) {
      console.log('Sound play error:', error);
      // Try fallback with existing audio
      if (this.audio) {
        try {
          this.audio.currentTime = 0;
          await this.audio.play();
          console.log('✅ Fallback sound played');
        } catch (fallbackError) {
          console.log('Fallback sound failed:', fallbackError);
        }
      }
    }
  }

  async showNotification(title, body) {
    console.log('📢 Showing notification:', title, body);
    
    // Play sound first
    await this.playSound();
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, { 
        body,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png'
      });
      return notification;
    } else {
      alert(`${title}: ${body}`);
      return null;
    }
  }

  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
      return permission;
    }
    return Notification.permission;
  }

  startOrderPolling(callback, interval = 5000) {
    return setInterval(callback, interval);
  }

  stopOrderPolling(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}

export default new NotificationService();