import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MusicPlayer } from '../../../services/music-player';
import { StateService } from '../../../services/state-service';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-l-navbar',
	imports: [RouterLink, RouterLinkActive, NgClass],
	templateUrl: './l-navbar.html',
	styleUrl: './l-navbar.scss',
})
export class LNavbar {
	musicPlayer = inject(MusicPlayer);
	router = inject(Router);
	stateService = inject(StateService);

	@ViewChild('navDiv') navDiv!: ElementRef<HTMLDivElement>;

	ngAfterViewInit() {
		this.stateService.navHeight.set(this.navDiv.nativeElement.offsetHeight);
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
