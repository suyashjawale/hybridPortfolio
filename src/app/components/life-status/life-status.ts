import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

export interface CodeLine {
	lineNum: number;
	html: string;
	stepId: number; // 0 = never active, else matches step index
	tooltip?: string;
}

export interface DebugStep {
	stepId: number;
	label: string;
	delay: number;
}

@Component({
	selector: 'app-life-status',
	imports: [CommonModule],
	templateUrl: './life-status.html',
	styleUrl: './life-status.scss',
})
export class LifeStatus implements OnInit, OnDestroy {
	readonly lines: CodeLine[] = [
		{ lineNum: 1, html: `<span class="cmt">// life.c — runtime: indefinite</span>`, stepId: 0 },
		{ lineNum: 2, html: `&nbsp;`, stepId: 0 },
		{ lineNum: 3, html: `<span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>`, stepId: 0 },
		{ lineNum: 4, html: `&nbsp;`, stepId: 0 },
		{ lineNum: 5, html: `<span class="type">void</span> <span class="fn">main</span><span class="punc">() {</span>`, stepId: 0 },
		{ lineNum: 6, html: `<span class="kw">&nbsp;&nbsp;&nbsp;while</span><span class="punc">(</span><span class="plain">true</span><span class="punc">) {</span>`, stepId: 1, tooltip: 'loop condition: always true' },
		{ lineNum: 7, html: `<span class="plain">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="call">eat</span><span class="punc">();</span>`, stepId: 2, tooltip: 'fuel acquired' },
		{ lineNum: 8, html: `<span class="type">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boolean</span> <span class="var">canExitLoop</span> <span class="op">=</span> <span class="call">work</span><span class="punc">();</span>`, stepId: 3, tooltip: 'returns: false' },
		{ lineNum: 9, html: `<span class="plain">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="call">sleep</span><span class="punc">();</span>`, stepId: 4, tooltip: 'see you tomorrow' },
		{ lineNum: 10, html: `<span class="kw">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if</span><span class="punc">(</span><span class="var">canExitLoop</span><span class="punc">)</span>`, stepId: 5, tooltip: 'evaluating... false ✗' },
		{ lineNum: 11, html: `<span class="kw">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break</span><span class="punc">;</span>`, stepId: 6, tooltip: 'unreachable' },
		{ lineNum: 12, html: `<span class="punc">&nbsp;&nbsp;&nbsp;}</span>`, stepId: 0 },
		{ lineNum: 12, html: `<span class="punc">&nbsp;&nbsp;&nbsp;somethingNew();</span>`, stepId: 0 },
		{ lineNum: 13, html: `<span class="punc">}</span>`, stepId: 0 },
	];

	readonly steps: DebugStep[] = [
		{ stepId: 1, label: 'while()', delay: 900 },
		{ stepId: 2, label: 'eat()', delay: 900 },
		{ stepId: 3, label: 'work()', delay: 1100 },
		{ stepId: 4, label: 'sleep()', delay: 900 },
		{ stepId: 5, label: 'if check → false', delay: 1000 },
	];

	activeStepId = signal<number>(0);
	iteration = signal<number>(1);

	canExitLoop = computed(() => false);

	private stepIndex = -1;
	private timeoutId: ReturnType<typeof setTimeout> | null = null;

	ngOnInit(): void {
		this.scheduleNext(600);
	}

	ngOnDestroy(): void {
		if (this.timeoutId) clearTimeout(this.timeoutId);
	}

	isActive(line: CodeLine): boolean {
		return line.stepId !== 0 && line.stepId === this.activeStepId();
	}

	private scheduleNext(delay: number): void {
		this.timeoutId = setTimeout(() => this.advance(), delay);
	}

	private advance(): void {
		this.stepIndex = (this.stepIndex + 1) % this.steps.length;
		const step = this.steps[this.stepIndex];

		this.activeStepId.set(step.stepId);

		// Tick iteration after completing a full cycle (after if-check)
		if (this.stepIndex === this.steps.length - 1) {
			this.iteration.update(i => i + 1);
		}

		this.scheduleNext(step.delay);
	}
}
