import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { StateService } from './services/state-service';
import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';
import { LNavbar } from './components/navbar/l-navbar/l-navbar';
import { MusicPlayer } from './services/music-player';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Sidebar, Navbar, LNavbar],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {

	isNavigating = signal(false);
	@ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

	constructor(public stateService: StateService, public router: Router, public playerState: MusicPlayer) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.isNavigating.set(true);
			}
			if (event instanceof NavigationEnd) {
				setTimeout(() => this.isNavigating.set(false), 300);
			}
		});
	}


	get audioEl(): HTMLAudioElement {
		return this.audioPlayerRef.nativeElement;
	}

	ngOnInit() {
		const savedTheme = localStorage.getItem('theme');

		if (savedTheme === 'light') {
			this.stateService.isLightTheme.set(true);
			document.body.classList.add('light-theme');
		}
	}

	@HostListener('click')
	onClick(): void {
		if (this.stateService.interaction() != 0) {
			this.stateService.interaction.update(val => val + 1);
		}
	}

	@HostListener('window:resize')
	onResize() {
		const windowSize = window.innerWidth;
		if (windowSize < 768) {
			this.stateService.isLargeScreen.set(false);
			this.stateService.isMediumScreen.set(false);
			this.stateService.numberOfColumns.set(2);
		}
		else if (windowSize < 992) {
			this.stateService.isMediumScreen.set(true);
			this.stateService.numberOfColumns.set(3);
		}
		else {
			this.stateService.isLargeScreen.set(true);
			this.stateService.isMediumScreen.set(false);
			this.stateService.numberOfColumns.set(4);
		}
	}

	onAudioEnded() {
		this.playerState.nextSong();
		setTimeout(() => this.playSong(), 50);
	}


	onAudioPaused() {
		this.playerState.pauseSong();
	}

	onAudioPlayed() {
		this.playerState.playSong();
	}

	playSong() {
		if (this.audioPlayerRef.nativeElement) {
			this.audioPlayerRef.nativeElement.play().then(() => {
				this.stateService.interaction.set(0);
				this.playerState.playSong();
			});
		}
	}

}
