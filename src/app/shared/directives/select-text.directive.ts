// select-text.directive.ts

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectText]',
  standalone: true,
})
export class SelectTextDirective {
  @HostListener('focus', ['$event.target'])
  onFocus(target: HTMLInputElement): void {
    this.selectText(target);
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLInputElement): void {
    this.selectText(target);
  }

  private selectText(target: HTMLInputElement): void {
    target.select();
  }
}
