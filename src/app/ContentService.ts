import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Content {
    id: number,
    title: string,
    content?: string,
    created?: string,
    modified?: string,
    accessed?: string
}

export interface Node {
    type: string,
    groups: string,
    properties: string,
    value: string,
    children: Node[]
}

const headers = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class ContentService {

   constructor(private http: HttpClient) { }

   create(content: Content) {
      return this.http.put<Content>('http://localhost:8080/content/create', content, headers);
   }

   read(id: number) {
      return this.http.get<Content>('http://localhost:8080/content/read/' + id, headers);
   }

   update(content: Content): Observable<Content> {
      return this.http.post<Content>('http://localhost:8080/content/update', content, headers);
   }

   delete(id: number) {
      return this.http.delete('http://localhost:8080/content/delete/' + id, headers);
   }

   getContentList() {
      return this.http.get<Content[]>('http://localhost:8080/content/list', headers);
   }

   getFormattedContent(id: number) {
      return this.http.get<Node[]>('http://localhost:8080/content/formatted/' + id, headers);
   }

   getContentNavigation(id: number) {
      return this.http.get<Node[]>('http://localhost:8080/content/navigation/' + id, headers);
   }

   searchTitles(searchStr: string) {
      return this.http.get<Content[]>('http://localhost:8080/content/searchTitles/' + searchStr, headers);
   }
}