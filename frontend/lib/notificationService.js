class NotificationService {
  constructor() {
    this.audio = null;
    this.audioInitialized = false;
    this.userInteracted = false;
    this.initAudio();
    this.setupUserInteractionListener();
  }

  setupUserInteractionListener() {
    const handleUserInteraction = () => {
      this.userInteracted = true;
      this.initAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
  }

  initAudio() {
    if (this.audioInitialized) return;
    
    try {
      // Try multiple possible paths for the audio file
      const audioPaths = [
        '/assets/notification.mp3',
        './assets/notification.mp3',
        '../assets/notification.mp3',
        'assets/notification.mp3'
      ];
      
      this.audio = new Audio(audioPaths[0]);
      this.audio.volume = 0.8;
      this.audio.preload = 'auto';
      
      // Test if audio can load
      this.audio.addEventListener('canplaythrough', () => {
        this.audioInitialized = true;
        console.log('✅ Audio initialized and ready');
      });
      
      this.audio.addEventListener('error', (e) => {
        console.log('Audio load error, trying alternative paths:', e);
        this.tryAlternativePaths(audioPaths.slice(1));
      });
      
    } catch (error) {
      console.log('Audio init error:', error);
    }
  }
  
  tryAlternativePaths(paths) {
    if (paths.length === 0) {
      console.log('❌ All audio paths failed');
      return;
    }
    
    const path = paths[0];
    const audio = new Audio(path);
    audio.volume = 0.8;
    
    audio.addEventListener('canplaythrough', () => {
      this.audio = audio;
      this.audioInitialized = true;
      console.log(`✅ Audio loaded from: ${path}`);
    });
    
    audio.addEventListener('error', () => {
      this.tryAlternativePaths(paths.slice(1));
    });
  }

  async playSound() {
    console.log('🔊 Attempting to play notification sound...');
    
    if (!this.userInteracted) {
      console.log('⚠️ No user interaction yet, sound may be blocked');
    }
    
    try {
      // Create fresh audio instance for better reliability
      const audio = new Audio('/assets/notification.mp3');
      audio.volume = 0.8;
      audio.currentTime = 0;
      
      // Add event listeners for debugging
      audio.addEventListener('loadstart', () => console.log('Audio loading started'));
      audio.addEventListener('canplay', () => console.log('Audio can start playing'));
      audio.addEventListener('play', () => console.log('Audio play event fired'));
      audio.addEventListener('ended', () => console.log('Audio playback ended'));
      
      await audio.play();
      console.log('✅ Sound played successfully');
      return true;
    } catch (error) {
      console.log('Primary sound play error:', error.message);
      
      // Try fallback with existing audio
      if (this.audio && this.audioInitialized) {
        try {
          this.audio.currentTime = 0;
          await this.audio.play();
          console.log('✅ Fallback sound played');
          return true;
        } catch (fallbackError) {
          console.log('Fallback sound failed:', fallbackError.message);
        }
      }
      
      // Final fallback - system beep
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
        
        console.log('✅ System beep played as fallback');
        return true;
      } catch (beepError) {
        console.log('System beep failed:', beepError.message);
        return false;
      }
    }
  }

  async showNotification(title, body) {
    console.log('📢 Showing notification:', title, body);
    
    // Play sound first
    await this.playSound();
    
    // Show notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          const notification = new Notification(title, { 
            body,
            icon: '/assets/logo.png',
            badge: '/assets/logo.png',
            requireInteraction: false,
            silent: true
          });
          
          setTimeout(() => {
            if (notification) notification.close();
          }, 5000);
          
          console.log('✅ Browser notification shown');
          return notification;
        } catch (notifError) {
          console.log('Browser notification failed:', notifError.message);
          alert(`${title}: ${body}`);
          return null;
        }
      } else if (Notification.permission === 'default') {
        console.log('⚠️ Requesting notification permission...');
        const permission = await this.requestPermission();
        if (permission === 'granted') {
          return this.showNotification(title, body);
        } else {
          console.log('❌ Notification permission denied');
          alert(`${title}: ${body}`);
          return null;
        }
      } else {
        console.log('❌ Notification permission denied');
        alert(`${title}: ${body}`);
        return null;
      }
    } else {
      console.log('❌ Notifications not supported');
      alert(`${title}: ${body}`);
      return null;
    }
  }
  
  getStatus() {
    return {
      audioInitialized: this.audioInitialized,
      userInteracted: this.userInteracted,
      notificationPermission: 'Notification' in window ? Notification.permission : 'not supported',
      audioSupported: 'Audio' in window,
      webAudioSupported: 'AudioContext' in window || 'webkitAudioContext' in window
    };
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