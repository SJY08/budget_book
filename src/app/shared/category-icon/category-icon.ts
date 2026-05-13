import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  templateUrl: './category-icon.html',
})
export class CategoryIconComponent {
  iconName = input<string>('Package');
  color = input<string>('#6B7280');
  size = input<number>(18);
}
