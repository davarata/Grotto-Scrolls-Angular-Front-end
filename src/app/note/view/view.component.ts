import { Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { ContentService, Node } from '../../ContentService';

@Component({
   selector: '[app-view]',
   templateUrl: './view.component.html',
   styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnChanges {

   @Input() id: number = 0;

   @ViewChild('viewContainer') viewContainer: ElementRef<HTMLElement> = {} as ElementRef;

   currentId: number = 0;
   formattedContent: Node[] = [];
   hrefCounter: number = 1;
   error: any;

   constructor(private contentService:ContentService, private renderer: Renderer2) { }

   ngOnChanges(): void {
      console.log('view.ngOnChanges: ' + this.currentId + ', ' + this.id);
      if (this.currentId != this.id) {
         this.currentId = this.id;
         this.readFormattedContent();
      }
   }

   readFormattedContent() {
      this.formattedContent = [];

      this.contentService.getFormattedContent(this.currentId).subscribe(
         result => {
            for (let node of (result as Node[])) {
               let children: Node[] = [];
               if (node.children != null) {
                  for (let childNode of (node.children as Node[])) {
                     children.push({
                        type: childNode.type,
                        groups: childNode.groups,
                        properties: childNode.properties,
                        value: childNode.value,
                        children: childNode.children
                     });
                     // console.log(' - [' + childNode.type + ', ' + childNode.groups + ', ' + childNode.properties + ', ' + childNode.value + ']');
                  }
               }

               this.formattedContent.push({
                  type: node.type,
                  groups: node.groups,
                  properties: node.properties,
                  value: node.value,
                  children: node.children
               });
               // console.log('[' + node.type + ', ' + node.groups + ', ' + node.properties + ', ' + node.value + ']');
            }
            this.renderText();
         }, error => this.error = error);
   }

   renderText() {
      while (this.viewContainer.nativeElement.childElementCount > 0) {
         this.renderer.removeChild(this.viewContainer.nativeElement, this.viewContainer.nativeElement.firstChild);
      }

      this.renderElement(this.viewContainer.nativeElement, this.formattedContent);
   }

   renderElement(parent: HTMLElement, elementContent: Node[]) {
      for (var index = 0; index < elementContent.length; index++) {
         let child = this.renderer.createElement(elementContent[index].type);
         if (elementContent[index].groups != '') {
            this.renderer.setAttribute(child, 'class', elementContent[index].groups.replace(';', ' '))
         }
         if (elementContent[index].properties != '') {
            this.renderer.setAttribute(child, 'style', elementContent[index].properties);
         }
         if (elementContent[index].type.startsWith('h') && elementContent[index].type != 'hr') {
            this.renderer.setAttribute(child, 'id', 'headingRef' + String(this.hrefCounter++));
         }
         if (elementContent[index].value != '') {
            this.renderer.appendChild(child, this.renderer.createText(elementContent[index].value));
         }
         if (elementContent[index].children != null && elementContent[index].children.length > 0) {
            this.renderElement(child, elementContent[index].children);
         }

         this.renderer.appendChild(parent, child);
      }
   }

}
