import { Component, signal } from '@angular/core';
import { DatePipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../services/state-service';
import { PROJECT_LIST } from './projects.index';
@Component({
  selector: 'app-projects',
  imports: [NgStyle, DatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})

export class Projects {
  projects = signal<any>([]);
  constructor(public stateService: StateService, private router: Router) { }

  goToProject(slug: string) {
    this.router.navigate(['project', slug]);
  }

  ngOnInit() {
    setTimeout(() => { 
      this.projects.set(PROJECT_LIST);
    }, 0);
  }

  onImgLoad(e: Event) {
    const img = e.target as HTMLImageElement;
    img.style.animationDelay = `${Math.random() * 120}ms`;
    img.classList.add('reveal');
  }
}
