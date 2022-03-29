import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, Content } from '../ContentService';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css']
})
export class WelcomeScreenComponent implements OnInit {

  content: Content[];
  error: any;

  constructor(private restService: ContentService, private router: Router) {
    this.content = [];
  }

  ngOnInit(): void {
    this.restService.getContentList().subscribe(
      data => {
        for (const d of (data as Content[])) {
          this.content.push({
            id: d.id,
            title: d.title,
            content: '',
            created: '',
            modified: '',
            accessed: ''
          });
        }
      }, error => this.error = error);
  }

  showContent(id: number) {
    this.router.navigate(['/note', id]);
  }
}
