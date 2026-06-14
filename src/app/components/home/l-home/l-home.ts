import { Component, computed, signal } from '@angular/core';
import { LinearEquilibrium } from "../../linear-equilibrium/linear-equilibrium";
import { experience_data } from '../../../data/experience_data';
import { college_data } from '../../../data/education_data';
import { organization } from '../../../interfaces/organization';
import { NgClass, NgStyle } from '@angular/common';
import { MusicPopup } from "../../music-popup/music-popup";
import { StateService } from '../../../services/state-service';
import { MusicPlayer } from '../../../services/music-player';

@Component({
	selector: 'app-l-home',
	imports: [LinearEquilibrium, MusicPopup, NgStyle, NgClass],
	templateUrl: './l-home.html',
	styleUrl: './l-home.scss',
})
export class LHome {

	organizations = signal<organization[]>(experience_data);
	college = signal<organization[]>(college_data);
	age = signal<number[]>([0, 0, 0]);
	readonly progressPct = computed(() => {
		const start = new Date('1999-08-03').getTime();
		const end = new Date('2029-08-03').getTime();
		const pct = ((Date.now() - start) / (end - start)) * 100;
		return Math.min(100, Math.max(0, pct));
	});

	constructor(public stateService: StateService, public musicPlayer: MusicPlayer) { }

	ngOnInit() {
		this.age.set(this.calculateDateDifference(new Date("1999-08-03"), new Date()));
	}

	calculateDateDifference(date1: Date, date2: Date) {
		let years = date2.getFullYear() - date1.getFullYear();
		let months = date2.getMonth() - date1.getMonth();
		let days = date2.getDate() - date1.getDate();

		if (days < 0) {
			months--;
			let lastMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
			days = lastMonth.getDate() - date1.getDate() + date2.getDate();
		}

		if (months < 0) {
			years--;
			months += 12;
		}
		return [years, months, days];
	}

	openLink(link: string) {
		window.open(link);
	}

	getExperience(date1: Date, date2: Date | string) {
		let date3 = new Date();
		let exp = this.calculateDateDifference(date1, date2 == 'Present' ? date3 : date2 as Date)
		return `${date1.toLocaleString('default', { month: 'short' })} ${date1.getFullYear()}  -  ${date2 == "Present" ? "Present" : date2.toLocaleString('default', { month: 'short' }) + " " + (date2 as Date).getFullYear()}  •  ${exp[0]} yrs ${exp[1]} mos`;
	}
}
