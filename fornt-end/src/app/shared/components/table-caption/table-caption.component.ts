import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-caption',
  standalone: false,
  templateUrl: './table-caption.component.html',
  styleUrl: './table-caption.component.scss'
})
export class TableCaptionComponent {
  @Input() table: any;
  @Input() title: string = '';
}
