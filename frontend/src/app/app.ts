import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './services/socket';
import { Subscription } from 'rxjs';

interface SoundItem {
  id: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected hasInteracted = false;
  private socketSubscription?: Subscription;

  protected readonly sounds: SoundItem[] = [
    { id: 'airhorn', label: 'Airhorn', path: 'sounds/airhorn.mp3' },
    { id: 'bruh', label: 'Bruh', path: 'sounds/bruh.mp3' },
    { id: 'crickets', label: 'Crickets', path: 'sounds/crickets.mp3' },
  ];

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    // Listen for broadcasted sound events from the server
    this.socketSubscription = this.socketService.onSoundBroadcast().subscribe({
      next: (soundId: string) => {
        this.playAudio(soundId);
      },
      error: (err) => {
        console.error('Socket communication error:', err);
      },
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks when component is destroyed
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  // Triggered when clicking a soundboard button
  protected onButtonClick(soundId: string): void {
    this.socketService.sendSoundTrigger(soundId);
  }

  // Mobile Audio Interaction Gate trigger
  protected enterSoundboard(): void {
    // Unlock mobile audio restriction by playing a short blank audio element
    const silentAudio = new Audio();
    silentAudio.src =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA';

    try {
      const playPromise = silentAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          console.warn('Audio context activation failed:', err);
        });
      }
    } catch (err) {
      console.warn('Error during silent audio play:', err);
    }

    // Set transitioned state immediately without waiting for the promise to resolve
    this.hasInteracted = true;
  }

  // Dynamically play the audio file using the HTML5 Audio API
  private playAudio(soundId: string): void {
    const sound = this.sounds.find((s) => s.id === soundId);
    if (sound) {
      const audio = new Audio(sound.path);
      audio.play().catch((err) => {
        console.error(`Failed to play sound "${soundId}":`, err);
      });
    } else {
      console.warn(`Received unknown sound ID from broadcast: ${soundId}`);
    }
  }
}
