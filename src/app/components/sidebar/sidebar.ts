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

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Site-Identity': 'portfolio-admin-v1'
		});

		this.http.post<any>(environment.domain + '.netlify/functions/getBirthdays', { "password": "" }, { headers }).subscribe({
			next: (data: any) => {
				this.stateService.highLights.update((item) => [...item, ...data.map((item: any) => ({
					uid: '',
					isBirthdayHighlight: true,
					content: `🥳🎉 ${item.message}`,
					imageLink: '',
					bigBanner: '',
					description: '',
					hasImage: false,
					link: '',
					publishedTime: '',
					source: '',
					rank: 1
				}))]);
			}
		});


		this.http.post(environment.domain + '.netlify/functions/getRssNews', { "url": "https://www.theguardian.com/uk/technology/rss" }, { responseType: 'text', headers })
			.subscribe({
				next: xml => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(xml.toString(), 'text/xml');
					const items = Array.from(xmlDoc.querySelectorAll('item'));

					this.stateService.highLights.update((item) => [...item, ...items.slice(0, 10).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						hasImage: true,
						description: rss.querySelector('description')?.textContent,
						imageLink: rss.getElementsByTagName('media:content')[0].getAttribute("url"),
						bigBanner: rss.getElementsByTagName('media:content')[2].getAttribute("url"),
						publishedTime: rss.querySelector('pubDate')?.textContent,
						source: 'www.theguardian.com',
						link: rss.querySelector('link')?.textContent,
						rank: 2,
						w: 0
					}))])
				}
			});

		this.http.post(environment.domain + '.netlify/functions/getRssNews', { "url": "https://news.google.com/rss/search?q=technology&hl=en-IN&gl=IN&ceid=IN:en" }, { responseType: 'text', headers })
			.subscribe({
				next: xml => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(xml.toString(), 'text/xml');
					const items = Array.from(xmlDoc.querySelectorAll('item'));

					this.stateService.highLights.update((item) => [...item, ...items.slice(0, 5).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						description: rss.querySelector('description')?.textContent,
						hasImage: true,
						imageLink: '/artifact/google.svg',
						bigBanner: '',
						publishedTime: rss.querySelector('pubDate')?.textContent,
						source: 'news.google.com',
						link: rss.querySelector('link')?.textContent,
						rank: 3,
						w: 0
					}))])
				}
			});


		this.http.get<any>('https://api.spaceflightnewsapi.net/v4/articles/?limit=5').subscribe({
			next: data => {
				this.stateService.highLights.update((item) => [...item, ...data.results.map((item: any) => ({
					uid: item.id,
					isBirthdayHighlight: false,
					content: item.title,
					hasImage: true,
					bigBanner: item.image_url,
					publishedTime: item.updated_at,
					source: 'api.spaceflightnewsapi.net',
					description: item.summary,
					imageLink: item.image_url,
					link: item.url,
					rank: 4,
				}))])
			}
		});

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