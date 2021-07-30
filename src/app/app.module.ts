import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SongComponent} from './song/song.component';
import {CategoryComponent} from './category/category.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

const routes: Routes = [
  {path: '', component: SongComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],

  providers: [HttpClient],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
