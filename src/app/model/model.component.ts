import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-model',
  standalone: true,
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
