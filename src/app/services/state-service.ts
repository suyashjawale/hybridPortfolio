import { computed, Injectable, signal } from '@angular/core';
import { Highlights } from '../interfaces/Highlights';
import { RedditPostVm } from '../interfaces/RedditPost';

@Injectable({
	providedIn: 'root'
})

export class StateService {
	interaction = signal<number>(1);
	isLargeScreen = signal<boolean>(window.innerWidth > 768);
	isMediumScreen = signal<boolean>(window.innerWidth >= 768 && window.innerWidth < 992);
	numberOfColumns = signal<number>(window.innerWidth < 768 ? 2 : window.innerWidth < 992 ? 3 : 4);
	isLightTheme = signal<boolean>(false);
	navHeight = signal<number>(0);
	canvasColour = computed(() => this.isLightTheme() ? '#111922' : '#ffffff');
	highLights = signal<Highlights[]>([]);
	redditPosts = signal<RedditPostVm[]>([]);
	collectionList = signal<any>([]);
	dialogueContent = signal<string>('');

	sortedHighLights = computed(() => {
		return this.highLights().sort((a, b) => a.rank - b.rank);
	});


	sortedRedditPosts = computed(() => {
		return this.redditPosts().sort((a, b) => b.createdUtc - a.createdUtc);
	});
}
