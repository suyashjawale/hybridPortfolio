import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { RedditService } from '../../services/reddit';

@Component({
	selector: 'app-read',
	imports: [CommonModule, DatePipe],
	templateUrl: './read.html',
	styleUrl: './read.scss',
})
export class Read {

	// posts = signal<any[]>([]);
	// loading = signal(true);
	// error = signal<string | null>(null);
	// expandedIds = signal<Set<string>>(new Set());

	// constructor(public http: HttpClient) { }

	// // https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=developersIndia&after=2026-06-17T14%3A23&link_flair_text=I+Made+This&limit=100&sort=asc

	// ngOnInit() {
	// 	this.http.get("https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=developersIndia&link_flair_text=I+Made+This&limit=100&sort=desc")
	// 		.subscribe({
	// 			next: (data: any) => {
	// 				console.log(data)
	// 			}
	// 		});

	// }

	private redditService = inject(RedditService);

	posts = signal<any[]>([]);
	loading = signal(true);
	error = signal<string | null>(null);

	ngOnInit(): void {

		this.redditService
			.getPosts()
			.subscribe({
				next: posts => {
					console.log(posts);
					// this.posts.set(posts);
					this.loading.set(false);
				},
				error: err => {
					console.error(err);
					this.error.set('Failed to load posts');
					this.loading.set(false);
				}
			});

	}

}
