import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { NgStyle, NgClass, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { StateService } from '../../services/state-service';


@Component({
	selector: 'app-s-posts',
	imports: [NgStyle, NgClass, DatePipe, FormsModule],
	templateUrl: './posts.html',
	styleUrl: './posts.scss'
})
export class Posts {
	@ViewChildren('contentDiv', { read: ElementRef }) contentDiv!: QueryList<ElementRef>;
	constructor(public stateService: StateService, private http: HttpClient, private router: Router) { }

	loadingData = signal<string>('loading');
	posts = signal<any[]>([]);
	imageCount = signal<number>(0);
	currentStatus = signal<string>('Fetching Data');
	numberField = signal<string>('');

	validateUser() {
		if (this.numberField().trim().length == 10) {
			this.loadingData.set('loading');
			this.getPosts(this.numberField().trim());
		}
	}

	ngOnInit() {
		if (localStorage.getItem('number') != undefined && localStorage.getItem('number') != null && localStorage.getItem('number') != '') {
			this.getPosts(localStorage.getItem('number') || '');
		}
		else {
			this.loadingData.set('validation');
		}
	}

	getPosts(number: string) {

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Site-Identity': 'portfolio-admin-v1'
		});

		this.http.post<any>(environment.domain + '.netlify/functions/getPosts', { "number": number }, { headers }).subscribe({
			next: data => {
				localStorage.setItem('number', number);
				data['posts'].forEach((item: any) => {
					item.divClip = '';
					item.imgClip = '';
				});
				
				this.posts.set(data['posts'].sort((a: any, b: any) => {
					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
				}))
				setTimeout(() => {
					this.contentDiv.forEach((elementRef: ElementRef, ind: number) => {
						if (this.posts()[ind].imageLink != "") {
							this.imageCount.update(cnt => cnt + 1);
						}
						this.applyClip(elementRef.nativeElement, this.posts()[ind], "div", ind);
					});
				}, 2);
			},
			error: err => {	
				if('status' in err.error)
				this.loadingData.set(err.error.status);
				else
				this.loadingData.set('failed');
			}
		});
	}

	applyClip(img: any, post: any, elemType: string, ind: number) {
		const rect = img.getBoundingClientRect();
		const w = rect.width;
		const h = rect.height;

		const diff = 25;

		const style = {
			width: w + 'px',
			height: h + 'px',
			overflow: 'hidden',
			clipPath: `path('M 0 0 L ${w} 0 L ${w} ${h - (diff * 2)} Q ${w} ${h - diff}, ${w - diff} ${h - diff} L ${diff} ${h - diff} Q 0 ${h - diff}, 0 ${h} Z')`
		};

		if (elemType == 'img') {
			post.imgClip = style;
			img.style.animationDelay = `${Math.random() * 120}ms`;
			img.classList.add('reveal');
		}
		else {
			post.divClip = style;
		}

		if (ind == this.posts().length - 1) {
			this.loadingData.set('loaded');
		}
	}

	openCollectionItem(identifier: string) {
		this.router.navigate(["/collection", identifier])
	}

}

