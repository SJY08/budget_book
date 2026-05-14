import { Injectable } from '@angular/core';
import { animate, stagger } from 'motion';

@Injectable({ providedIn: 'root' })
export class MotionService {
  staggerIn(selector: string) {
    animate(
      selector,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
      { delay: stagger(0.08), duration: 0.35 },
    );
  }

  fadeUp(el: Element, delay = 0) {
    animate(
      el,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
      { duration: 0.35, delay },
    );
  }

  fadeIn(el: Element, delay = 0) {
    animate(el, { opacity: [0, 1] }, { duration: 0.25, delay });
  }

  modalIn(el: Element) {
    animate(
      el,
      { transform: ['translateY(100%)', 'translateY(0%)'] },
      { duration: 0.35, easing: [0.32, 0.72, 0, 1] },
    );
  }

  modalOut(el: Element) {
    return animate(el, { transform: ['translateY(0%)', 'translateY(100%)'] }, { duration: 0.25 });
  }

  scaleIn(el: Element, delay = 0) {
    animate(
      el,
      { opacity: [0, 1], transform: ['scale(0.92)', 'scale(1)'] },
      { duration: 0.3, delay },
    );
  }
}
