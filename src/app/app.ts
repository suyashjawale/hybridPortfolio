import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { StateService } from './services/state-service';
import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';
import { LNavbar } from './components/navbar/l-navbar/l-navbar';
import { MusicPlayer } from './services/music-player';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';
import { RedditPostVm } from './interfaces/RedditPost';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Sidebar, Navbar, LNavbar],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {

	isNavigating = signal(false);
	@ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

	constructor(public stateService: StateService, public router: Router, public playerState: MusicPlayer, private http: HttpClient) {
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
				this.stateService.highLights.update(current => [
					...current,
					...data.results.map((result: any) => ({
						uid: result.id,
						isBirthdayHighlight: false,
						content: result.title,
						hasImage: true,
						bigBanner: result.image_url,
						publishedTime: result.updated_at,
						source: 'api.spaceflightnewsapi.net',
						description: result.summary,
						imageLink: result.image_url,
						link: result.url,
						rank: 4,
					}))
				]);
			}
		});


		this.http.get<any>('https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=developersIndia&link_flair_text=I+Made+This&limit=100&sort=desc').subscribe({
			next: (result: any) => {
				let redditPosts : RedditPostVm[] = [];
				for (const post of result.data) {
					if (post.selftext !== '[removed]' && post.selftext !== '[deleted]' && !post.removed_by_category) {
						if (redditPosts.length > 25) {
							break;
						}

						let vm: RedditPostVm ={
							id: post.id,
							title: post.title,
							description: post.selftext || '',
							createdUtc: post.created_utc,
							upvotes: post.ups,
							contentType: 'text'
						};

						// Crosspost
						if (post.crosspost_parent_list?.length) {
							vm.contentType = 'crosspost';
							vm.crosspost = post.crosspost_parent_list[0];
						}


						// Reddit Gallery
						if (post.gallery_data?.items?.length) {
							vm.contentType = 'gallery';
							vm.gallery = post.gallery_data.items
								.map((item: any) => {
									const media =
										post.media_metadata?.[item.media_id];
									return media?.s?.u
										?.replace(/&amp;/g, '&');
								})
								.filter(Boolean);
						}

						// Reddit Video
						if (post.is_video && post.media?.reddit_video?.fallback_url) {
							vm.contentType = 'video';
							vm.video = post.media.reddit_video.fallback_url;
						}

						// Youtube
						if (post.media?.oembed?.provider_name === 'YouTube') {
							vm.contentType = 'youtube';
							const html = post.media.oembed.html;
							const match = html.match(/embed\/([^"?]+)/);
							const videoId = match?.[1];
							vm.youtube = {
								embedUrl:
									`https://www.youtube.com/embed/${videoId}`,
								thumbnail:
									post.media.oembed.thumbnail_url
							};
						}

						// Single image
						if (post.post_hint === 'image' || post.preview?.images?.length) {
							vm.contentType = 'image';
							vm.image =
								post.url_overridden_by_dest ||
								post.preview.images[0].source.url;
						}

						// External website / Github
						if (!post.is_self && post.url_overridden_by_dest) {
							vm.contentType = 'link';
							vm.link = {
								url: post.url_overridden_by_dest,
								domain: post.domain,
								image:
									post.preview?.images?.[0]?.source?.url
							};
						}

						redditPosts.push(vm);

					}
				}

				this.stateService.redditPosts.set(redditPosts);
			}
		});

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
