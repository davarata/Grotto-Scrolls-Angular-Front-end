import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { ContentService } from './ContentService';
import { NoteComponent } from './note/note.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './note/edit/edit.component';
import { ViewComponent } from './note/view/view.component';
import { NavigationComponent } from './note/navigation/navigation.component';
import { SearchComponent } from './note/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeScreenComponent,
    NoteComponent,
    EditComponent,
    ViewComponent,
    NavigationComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ContentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
