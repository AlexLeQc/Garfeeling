import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SocketService } from './services/socket';
import { Observable, of } from 'rxjs';

describe('App', () => {
  let mockSocketService: {
    sendSoundTrigger: (name: string) => void;
    onSoundBroadcast: () => Observable<string>;
  };

  beforeEach(async () => {
    mockSocketService = {
      sendSoundTrigger: () => {},
      onSoundBroadcast: () => of('')
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: SocketService, useValue: mockSocketService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render splash screen initially', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.splash-title')?.textContent).toContain('Garfeeling');
  });

  it('should transition to soundboard when "Join the Chaos" is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('#join-chaos-btn') as HTMLButtonElement;
    expect(button).toBeTruthy();
    
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('.app-title')?.textContent).toContain('Garfeeling');
    expect(compiled.querySelector('.sound-grid')).toBeTruthy();
  });
});
