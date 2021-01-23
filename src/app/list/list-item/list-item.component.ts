import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.styl']
})
export class ListItemComponent {
  @Input() name: string;
  @Input() description: string;
  @Input() date: string;
  @Input() editable: boolean;

  @Output() undoEdit = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onUndoEdit(e: Event): void {
    e.stopPropagation();
    this.undoEdit.emit();
  }

  onEdit(e: Event): void {
    e.stopPropagation();
    this.edit.emit();
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    this.delete.emit();
  }
}
