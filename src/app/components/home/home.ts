import { Component } from '@angular/core';
import { StateService } from '../../services/state-service';
import { LHome } from './l-home/l-home';
import { SHome } from './s-home/s-home';
@Component({
	selector: 'app-home',
	imports: [LHome,SHome],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
		constructor(public stateService: StateService) { }
}
