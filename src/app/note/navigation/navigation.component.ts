import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, ViewChild } from '@angular/core';
import { Content, ContentService, Node } from '../../ContentService';

@Component({
   selector: '[app-navigation]',
   templateUrl: './navigation.component.html',
   styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnChanges {

   @Input() id: number = 0;
   @Input() otherItems: Content[] = [];

   @Output() viewItemEvent = new EventEmitter<{id: number}>();

   @ViewChild('navigationArea') navigation: ElementRef<HTMLElement> = {} as ElementRef;

   currentId: number = 0;
   contentNavigation: Node[] = [];
   hrefCounter: number = 1;
   error: any;

   constructor(private contentService:ContentService, private renderer: Renderer2) { }

   ngOnChanges() {
      if (this.id != this.currentId) {
         this.currentId = this.id;
         this.getContentNavigation();
      }
   }

   viewItem(id: number) {
      this.viewItemEvent.emit({id: id});
   }

   getContentNavigation() {
      this.contentNavigation = [];

      this.contentService.getContentNavigation(this.currentId).subscribe(
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
                     // console.log(' - [' + childElement.type + ', ' + childElement.groups + ', ' + childElement.properties + ', ' + childElement.value + ']');
                  }
               }

               this.contentNavigation.push({
                  type: node.type,
                  groups: node.groups,
                  properties: node.properties,
                  value: node.value,
                  children: node.children
               });
               // console.log('[' + element.type + ', ' + element.groups + ', ' + element.properties + ', ' + element.value + ']');
            }
            this.renderText();
         }, error => this.error = error);
   }

   renderText() {
      while (this.navigation.nativeElement.childElementCount > 0) {
         this.renderer.removeChild(this.navigation.nativeElement, this.navigation.nativeElement.firstChild);
      }

      this.renderElement(this.navigation.nativeElement, this.contentNavigation);
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
         // if (elementContent[index].type== 'a') {
         //    this.renderer.setAttribute(child, 'href', '#headingRef' + String(this.hrefCounter++));
         // }
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
