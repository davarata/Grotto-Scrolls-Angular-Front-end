import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Content, ContentService } from '../../ContentService';

@Component({
   selector: '[app-edit]',
   templateUrl: './edit.component.html',
   styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

   @Input() id: number = 0;
   @Input() action: string = '';

   @Output() editEvent = new EventEmitter<{action: string, id: number}>();

   content: Content = <Content> { };
   error: any;

   constructor(private contentService:ContentService) { }

   ngOnInit(): void { }

   ngAfterContentInit(): void {
      this.readContent();
   }

   save() {
      if (this.action == 'new') {
         this.createContent();
      } else if (this.action == 'edit') {
         this.updateContent();
      }
   }

   cancel() {
      this.editEvent.emit({action: 'view', id: this.id});
   }

   readContent() {
      if (this.action == 'edit') {
         this.contentService.read(this.id).subscribe((data: Content) => this.content = { ...data }, error => this.error = error);
      }
   }

   createContent() {
      this.contentService.create(this.content).subscribe(
         (result: Content) => {
            this.content = { ...result }
            this.id = this.content.id;
            this.editEvent.emit({action: 'view', id: this.id});
         }, error => this.error = error);
   }

   updateContent() {
      this.contentService.update(this.content).subscribe(
         (result: Content) => {
            this.content = { ...result }
            this.editEvent.emit({action: 'view', id : this.id});
         }, error => this.error = error);
   }

}
