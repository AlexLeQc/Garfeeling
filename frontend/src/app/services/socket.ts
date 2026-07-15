import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = `http://${window.location.hostname}:3000`;

  constructor() {
    // Establish the connection to your Node.js backend
    this.socket = io(this.SERVER_URL);
  }

  // Send a sound trigger event to the server
  sendSoundTrigger(soundName: string): void {
    this.socket.emit('trigger-sound', soundName);
  }

  // Listen for broadcasted sounds coming down from the server
  onSoundBroadcast(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('play-sound-broadcast', (soundName: string) => {
        observer.next(soundName);
      });
    });
  }
}
