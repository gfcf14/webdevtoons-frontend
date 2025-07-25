import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  slidIn = false;
  startCountDown = false;
  code = 404;
  shouldAnimate = false;
  fadeWhite = false;

  private timeouts: any[] = [];

  constructor(private titleService: Title, private router: Router) {}

  ngOnInit(): void {
    this.titleService.setTitle("WebDevToons: 404 not found");
    this.schedule();
  }

  ngOnDestroy(): void {
    this.timeouts.forEach(clearTimeout);
  }

  private schedule() {
    if (!this.slidIn) {
      this.timeouts.push(setTimeout(() => {
        this.slidIn = true;
        this.schedule();
      }, 500));
    } else if (!this.startCountDown) {
      this.timeouts.push(setTimeout(() => {
        this.startCountDown = true;
        this.schedule();
      }, 2000));
    } else if (this.code > 200) {
      this.timeouts.push(setTimeout(() => {
        this.code -= 1;
        this.schedule();
      }, 12.5));
    } else if (!this.shouldAnimate) {
      this.shouldAnimate = true;
      this.timeouts.push(setTimeout(() => {
        this.fadeWhite = true;
      }, 5000));
      this.timeouts.push(setTimeout(() => {
        this.router.navigate(['/']);
      }, 10000));
    }
  }

  get codeStatus(): string {
    if (this.code <= 384 && this.code >= 324) return 'warning';
    if (this.code < 324 && this.code >= 254) return 'almost';
    if (this.code < 254 && this.code >= 200) return 'ready';
    return '';
  }
}
