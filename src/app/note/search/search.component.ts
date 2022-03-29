import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Content, ContentService } from '../../ContentService';

@Component({
   selector: '[app-search]',
   templateUrl: './search.component.html',
   styleUrls: ['./search.component.css']
})
export class SearchComponent {

   @Output() searchEvent = new EventEmitter<{id : number}>();

   searchStr: string = '';
   searchResults: Content[] = [];
   error: any;

   constructor(private contentService: ContentService) { }

   search() {
      if (this.searchStr.trim() == '') {
         this.contentService.getContentList().subscribe(
            result => this.populate(result),
            error => this.error = error);
      } else {
         this.contentService.searchTitles(this.searchStr).subscribe(
            result => this.populate(result),
            error => this.error = error);
      }
   }

   populate(result: Content[]) {
      for (const c of result) {
         this.searchResults.push({id: c.id, title: c.title});
      }
   }

   open(itemId: number) {
      this.searchEvent.emit({id: itemId});
   }
}
