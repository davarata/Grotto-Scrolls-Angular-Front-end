import { componentFactoryName } from '@angular/compiler';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';
import { Content, ContentService } from '../ContentService';

@Component({
   selector: 'app-note',
   templateUrl: './note.component.html',
   styleUrls: ['./note.component.css', './options.css']
})
export class NoteComponent implements OnInit {

   action: string = 'view';
   id: number = -1;
   content: Content = <Content> {id: 0, title: ''};
   otherItems: Content[] = [];
   error: any;

   @ViewChild('viewOption') viewOption: ElementRef<HTMLElement> = {} as ElementRef;
   @ViewChild('editOption') editOption: ElementRef<HTMLElement> = {} as ElementRef;

   constructor(private activatedroute:ActivatedRoute, private renderer: Renderer2, private contentService: ContentService, private router: Router) { }

   ngOnInit(): void {
      this.activatedroute.paramMap.subscribe(params => this.paramChange(params));
   }

   paramChange(params: any) {
      console.log('paramChange' + params.get('id'));
      this.id = (params.get('id') == null ? 0: parseInt(params.get('id')));

      this.action = 'view';
      this.readContent();
   }

   viewItemChanged(event: any) {
      this.id = event.id;
      this.updateOtherItems();
      this.readContent();
   }

   editCompleted(event: any) {
      this.id = event.id;
      this.changeMode(event.action);
   }

   searchCompleted(event: any) {
      if (this.id != event.id) {
         this.id = event.id;
         this.updateOtherItems();
         this.readContent();
      }
      this.changeMode('view');
   }

   changeMode(newAction: string) {
      if (this.action != newAction) {
         if (newAction == 'new') {
            this.id = 0;
            this.renderer.setAttribute(this.viewOption.nativeElement, 'class', 'option-entry');
            this.renderer.setAttribute(this.editOption.nativeElement, 'class', 'option-entry selected-option');
         } else if (newAction == 'view') {
            this.renderer.setAttribute(this.viewOption.nativeElement, 'class', 'option-entry selected-option');
            this.renderer.setAttribute(this.editOption.nativeElement, 'class', 'option-entry');
            this.readContent();
         } else if (newAction == 'edit') {
            this.renderer.setAttribute(this.viewOption.nativeElement, 'class', 'option-entry');
            this.renderer.setAttribute(this.editOption.nativeElement, 'class', 'option-entry selected-option');
         } else if (newAction == 'open') {
            this.renderer.setAttribute(this.viewOption.nativeElement, 'class', 'option-entry');
            this.renderer.setAttribute(this.editOption.nativeElement, 'class', 'option-entry');
         } else if (newAction == 'close' || newAction == 'delete') {
            if (newAction == 'delete') {
              this.contentService.delete(this.id).subscribe(error => this.error = error);
            }

            if (this.otherItems.length == 0) {
               this.router.navigate(['/welcome']);
            } else {
               this.id = this.otherItems[0].id;
               this.content.id = 0;

               this.updateOtherItems();
               this.readContent();
               newAction = 'view';
            }
         }
      }
      this.action = newAction;
   }

   readContent() {
      this.contentService.read(this.id).subscribe((data: Content) => this.content = { ...data }, error => this.error = error);
   }

   updateOtherItems() {
      console.log('updateOtherItems');
      let index = this.indexOf(this.id);
      if (index >= 0) {
         this.otherItems.splice(index, 1);
      }

      if (this.content.id != 0) {
         let item:Content[] = [{id: this.content.id, title: this.content.title}];
         this.otherItems = item.concat(this.otherItems);
      }
   }

   indexOf(id: number) {
      let index: number = 0;
      for (let content of this.otherItems) {
         if (content.id == id) {
            return index;
         }
         index++;
      }

      return -1;
   }

}
