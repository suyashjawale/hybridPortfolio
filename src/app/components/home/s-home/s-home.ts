import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { LinearEquilibrium } from '../../linear-equilibrium/linear-equilibrium';
import { experience_data } from '../../../data/experience_data';
import { organization } from '../../../interfaces/organization';
import { college_data } from '../../../data/education_data';

@Component({
  selector: 'app-s-home',
  imports: [NgClass, LinearEquilibrium],
  templateUrl: './s-home.html',
  styleUrl: './s-home.scss',
})
export class SHome {
	organizations = signal<organization[]>(experience_data);
	college = signal<organization[]>(college_data);

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
