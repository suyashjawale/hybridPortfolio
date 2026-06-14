import { Component } from '@angular/core';
import { StateService } from '../../services/state-service';
import { LNavbar } from './l-navbar/l-navbar';
import { SNavbar } from './s-navbar/s-navbar';

@Component({
  selector: 'app-navbar',
  imports: [SNavbar,LNavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
    constructor(public stateService: StateService) { }
}
