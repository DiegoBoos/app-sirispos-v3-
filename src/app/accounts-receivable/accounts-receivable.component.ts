import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accounts-receivable',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './accounts-receivable.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountsReceivableComponent { }
