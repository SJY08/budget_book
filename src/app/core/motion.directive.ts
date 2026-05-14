import { Directive, ElementRef, OnInit, input } from '@angular/core';
import { animate } from 'motion';

@Directive({
  selector: '[motionFade]',
  standalone: true,
})
export class MotionFadeDirective implements OnInit {
  delay = input<number>(0);

  constructor(private el: ElementRef) {}

  ngOnInit() {
    animate(
      this.el.nativeElement,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
      { duration: 0.35, delay: this.delay() },
    );
  }
}
