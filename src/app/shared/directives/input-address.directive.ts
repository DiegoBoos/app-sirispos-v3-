import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[inputAddress]',
  standalone: true,
})
export class InputAddressDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedCharacters = /^[a-zA-Z0-9\s#ñÑ]*$/;
    const key = event.key;

    if (!allowedCharacters.test(key)) {
      event.preventDefault();
    }
  }
}
