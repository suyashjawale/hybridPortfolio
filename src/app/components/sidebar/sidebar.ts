import { Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DecimalPipe, NgStyle, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StateService } from '../../services/state-service';
import { MusicPlayer } from '../../services/music-player';
import { environment } from '../../../environment/environment';
import { Highlights } from '../../interfaces/Highlights';
import { MusicPopup } from "../music-popup/music-popup";

@Component({
	selector: 'app-sidebar',
	imports: [RouterLink, RouterLinkActive, NgStyle, MusicPopup],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})

export class Sidebar {
	isFullScreen = signal(false);
	currentHighlight = signal(0);
	isOpen = signal(false);

	constructor(public playerState: MusicPlayer, public stateService: StateService, private http: HttpClient, private router: Router) {
	}

	strip(html: string) {
		let doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	}

	ngOnInit() {
		this.isOpen.set(true);
	}

	decodeHtml(html: string): string {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	}

	toggleFullScreen() {
		const element: any = document.documentElement;
		if (this.isFullScreen()) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((document as any).mozCancelFullScreen) { // Firefox
				(document as any).mozCancelFullScreen();
			} else if ((document as any).webkitExitFullscreen) { // Chrome, Safari and Opera
				(document as any).webkitExitFullscreen();
			} else if ((document as any).msExitFullscreen) { // IE/Edge
				(document as any).msExitFullscreen();
			}
			this.isFullScreen.set(false);
		} else {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) { // Firefox
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) { // IE/Edge
				element.msRequestFullscreen();
			}
			this.isFullScreen.set(true);
		}
	}

	animationDone() {
		// The animation has completed, so we advance to the next highlight
		if (this.stateService.highLights().length > 1)
			this.currentHighlight.update(val => (val + 1) % this.stateService.highLights().length);
		this.isOpen.set(false);
		// Toggle isOpen to restart the animation for the next highlight
		setTimeout(() => {
			this.isOpen.set(true);
		}, 0); // Small delay to ensure the class is removed and re-added
	}

	openHighlight(highlight: Highlights) {
		if (highlight.isBirthdayHighlight) {
			this.router.navigate(['/updates']);
		}
		else {
			this.openLink(highlight.link);
		}
	}

	openLink(link: string) {
		window.open(link);
	}

	toggleTheme(): void {
		this.stateService.isLightTheme.update(val => !val);

		if (this.stateService.isLightTheme()) {
			document.body.classList.add('light-theme');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.classList.remove('light-theme');
			localStorage.setItem('theme', 'dark');
		}
	}

}