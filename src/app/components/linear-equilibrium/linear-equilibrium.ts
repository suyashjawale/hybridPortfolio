import { AfterViewInit, Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { StateService } from '../../services/state-service';

@Component({
	selector: 'app-linear-equilibrium',
	imports: [],
	templateUrl: './linear-equilibrium.html',
	styleUrl: './linear-equilibrium.scss'
})
export class LinearEquilibrium implements AfterViewInit{
	@ViewChild('myCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  width = 600;
  height = 600;
  i = 6;
  first = signal(true);
  dissolving = signal(false);   // ← NEW
  ctx!: CanvasRenderingContext2D;

  constructor(private stateService: StateService) {}

  ngAfterViewInit() {
    this.nextStep();
  }


	private generatePoints(n: number): [number, number][] {
		const points: [number, number][] = [];
		const d = (2 * Math.PI) / n;
		for (let i = 0; i < n; i++) {
			const x = this.width / 2 + (this.width / 2 - 20) * Math.cos(d * i);
			const y = this.height / 2 + (this.height / 2 - 20) * Math.sin(d * i);
			points.push([x, y]);
		}
		return points;
	}

	private animateLineDrawing(x1: number, y1: number, x2: number, y2: number): Promise<void> {
		return new Promise((resolve) => {
			const ctx = this.ctx;
			const duration = 1000;
			const start = performance.now();

			// Keep track of where the previous frame ended
			let lastX = x1;
			let lastY = y1;

			const animate = (currentTime: number) => {
				let progress = (currentTime - start) / duration;
				if (progress > 1) progress = 1;

				// 1. Calculate the current target point for this frame
				const currentX = x1 + (x2 - x1) * progress;
				const currentY = y1 + (y2 - y1) * progress;

				// 2. Always grab the latest color right before drawing
				ctx.strokeStyle = this.stateService.canvasColour();

				// 3. Draw ONLY the segment between the last frame and this frame
				ctx.beginPath();
				ctx.moveTo(lastX, lastY);
				ctx.lineTo(currentX, currentY);
				ctx.stroke();

				// 4. Update the history pointer to the end of this segment
				lastX = currentX;
				lastY = currentY;

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					resolve();
				}
			};
			requestAnimationFrame(animate);
		});
	}

	private drawLines(points: [number, number][]): Promise<void> {
		return new Promise(async (resolve) => {
			const canvas = this.canvasRef?.nativeElement;
			this.ctx = canvas.getContext('2d')!;
			this.ctx.lineWidth = 1.5;
			// (Removed static strokeStyle assignment from here)

			for (let i = 0; i < points.length; i++) {
				for (let j = i + 1; j < points.length; j++) {
					await this.animateLineDrawing(points[i][0], points[i][1], points[j][0], points[j][1]);
					
					if (i === points.length - 2 && j === points.length - 1) {
						setTimeout(() => {
							this.ctx.clearRect(0, 0, this.width, this.height);
							resolve();
						}, 3000);
					}
				}
			}
		});
	}

private async vectorEquilibrium(n: number) {
    const points = this.generatePoints(n);
    await this.drawLines(points);
    this.nextStep();
  }

  private nextStep() {
    if (this.i === 27) this.i = 6;

    if (this.first()) {
      setTimeout(() => {
        // 1. trigger the exit animation on the intro card
        this.dissolving.set(true);

        // 2. after exit animation completes (800ms), flip first()
        setTimeout(() => {
          this.first.set(false);
          setTimeout(() => this.nextStep(), 600);
        }, 850);
      }, 4200);   // let intro breathe for 4.2s
    } else {
      this.vectorEquilibrium(this.i++);
    }
  }
}
