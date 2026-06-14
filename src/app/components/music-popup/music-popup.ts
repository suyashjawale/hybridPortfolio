import { HttpClient } from '@angular/common/http';
import { Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MusicPlayer } from '../../services/music-player';
import { StateService } from '../../services/state-service';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { App } from '../../app';

@Component({
	selector: 'app-music-popup',
	imports: [NgClass, DecimalPipe, NgStyle],
	templateUrl: './music-popup.html',
	styleUrl: './music-popup.scss',
})
export class MusicPopup {

	@ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;

	private progressAnimationFrame: number | null = null;
	private isUserSeeking = false;
	currentSongTime = signal<number>(0);

	constructor(public playerState: MusicPlayer, public stateService: StateService, private http: HttpClient, private router: Router, public app: App) {
		effect(() => {
			if (this.stateService.interaction() != 0) {
				this.playSong();
			}
		});
	}

	ngAfterViewInit() {
		this.startProgressLoop();
	}

	ngOnDestroy() {
		this.stopProgressLoop();
	}

	openLink(link: string) {
		window.open(link);
	}

	private startProgressLoop() {
		const update = () => {
			const audio = this.app.audioEl;
			const progressBar = this.progressBarRef.nativeElement;

			if (!audio.paused && !audio.ended && !this.isUserSeeking) {
				const currentTime = audio.currentTime;
				this.currentSongTime.set(currentTime);
				progressBar.value = String(currentTime);
			}

			this.progressAnimationFrame = requestAnimationFrame(update);
		};
		this.progressAnimationFrame = requestAnimationFrame(update);
	}

	private stopProgressLoop() {
		if (this.progressAnimationFrame !== null) {
			cancelAnimationFrame(this.progressAnimationFrame);
			this.progressAnimationFrame = null;
		}
	}

	seekAudio(event: Event) {
		const audio = this.app.audioEl;
		const slider = event.target as HTMLInputElement;
		audio.currentTime = parseFloat(slider.value);
	}

	onSeekStart() { this.isUserSeeking = true; }
	onSeekEnd() { this.isUserSeeking = false; }

	previousSong() { this.playerState.previousSong(); setTimeout(() => this.playSong(), 50); }
	nextSong() { this.playerState.nextSong(); setTimeout(() => this.playSong(), 50); }

	pauseSong() {
		if (this.app.audioEl) {
			this.app.audioEl.pause();
			this.playerState.pauseSong();
		}
	}

	playSong() {
		if (this.app.audioEl) {
			this.app.audioEl.play().then(() => {
				this.stateService.interaction.set(0);
				this.playerState.playSong();
			});
		}
	}
}
