import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IconCopy} from "../icons/icons/iconCopy";

@Component({
  selector: 'app-copy-text',
  templateUrl: './copy-text.component.html',
  styleUrls: ['./copy-text.component.scss']
})
export class CopyTextComponent {

  @Input() text: string;
  @Output() copyChange = new EventEmitter<void>();

  iconCopy = IconCopy;

  onCopy() {
    navigator.clipboard.writeText(this.text).then(() => {
      this.copyChange.emit();
    });
  }
}
