import { Component, signal } from '@angular/core';
import { DatePipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../services/state-service';
import { BLOG_LIST } from './blogs.index';
@Component({
	selector: 'app-blogs',
	imports: [NgStyle, DatePipe],
	templateUrl: './blogs.html',
	styleUrl: './blogs.scss',
})

export class Blogs {
	blogs = signal<any>([]);
	constructor(public stateService: StateService, private router: Router) { }

	goToBlog(slug: string) {
		this.router.navigate(['blog', slug]);
	}

	ngOnInit() {
		setTimeout(() => { 
			this.blogs.set(BLOG_LIST);
		}, 0);
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}
}
