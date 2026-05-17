import { Directive, ElementRef, OnInit, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[swipeable]',
  standalone: true,
})
export class SwipeDirective implements OnInit, OnDestroy {
  swipeLeft = output<void>();
  swipeRight = output<void>();

  private startX = 0;
  private startY = 0;
  private threshold = 30;

  private onTouchStart = (e: TouchEvent) => {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  };

  private onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - this.startX;
    const dy = e.changedTouches[0].clientY - this.startY;
    if (Math.abs(dx) < this.threshold) return;
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;
    if (dx < 0) this.swipeLeft.emit();
    else this.swipeRight.emit();
  };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.el.nativeElement.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('touchstart', this.onTouchStart);
    this.el.nativeElement.removeEventListener('touchend', this.onTouchEnd);
  }
}
