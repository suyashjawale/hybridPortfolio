import { Component, effect, ElementRef, HostListener, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StateService } from '../../services/state-service';
import { environment } from '../../../environment/environment';

@Component({
	selector: 'app-captures',
	imports: [NgStyle, NgClass],
	templateUrl: './captures.html',
	styleUrl: './captures.scss'
})
export class Captures {

	left = signal<any>([]);
	right = signal<any>([]);
	loadingData = signal<string>('loading');
	loadedCount = signal<number>(0);
	data = signal<any>([]);
	PROBE_URL = 'https://dl.dropboxusercontent.com/scl/fi/0xrv1blio860szukuvqx3/Ganpati-Bappa-14.jpg?rlkey=34yi30dvvp4fxyxbtyqn4qtee&dl=0';

	constructor(public stateService: StateService, private router: Router, private http: HttpClient) {
		effect(() => {
			if (this.stateService.numberOfColumns() > 0 && this.stateService.collectionList().length > 0) {
				this.hydrate(this.stateService.collectionList());
			}
		});
	}

	async ngOnInit() {
		setTimeout(() => {
			if (this.stateService.collectionList().length == 0) {

				const headers = new HttpHeaders({
					'Content-Type': 'application/json',
					'X-Site-Identity': 'portfolio-admin-v1'
				});
				this.http.get<any>(environment.domain + '.netlify/functions/getCollection', { headers }).subscribe({
					next: async data => {
						data.sort((a: any, b: any) => a.priority - b.priority);
						this.stateService.collectionList.set(data);

						const t0 = performance.now();
						const cacheRes = await fetch(this.PROBE_URL, {
							cache: 'force-cache',
							headers: {
								'Range': `bytes=0-${50_000 - 1}`
							}
						});
						const buf = await cacheRes.arrayBuffer();
						const ms = performance.now() - t0;
						const receivedBytes = buf.byteLength;
						this.stateService.dialogueContent.set(parseFloat(((receivedBytes * 8) / (ms / 1000) / 1_000).toFixed(1)) < 3000 ? 'Slow network detected.' : '');
						this.hydrate(data);
					},
					error: err => {
						this.loadingData.set('failed');
					}
				});
			}
			else {
				this.hydrate(this.stateService.collectionList());
			}
		}, 0);
	}


	masonryColumns(data: any[], count: number): any[][] {
		const cols: any[][] = Array.from({ length: count }, () => []);
		const heights = new Array(count).fill(0);

		data.forEach((img: any) => {
			const shortest = heights.indexOf(Math.min(...heights));
			cols[shortest].push(img);
			heights[shortest] += img.height;
		});

		return cols; // [arr1, arr2, arr3, arr4]
	}

	async hydrate(data: any) {
		this.data.set(this.masonryColumns(data, this.stateService.numberOfColumns()));
		this.loadingData.set('loaded');
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
		this.loadedCount.update(n => n + 1);
		if (this.loadedCount() > 35) {
			this.stateService.dialogueContent.set('');
		}
	}

	openCollectionItem(collectionName: number) {
		this.router.navigate(["/collection", collectionName])
	}
}
