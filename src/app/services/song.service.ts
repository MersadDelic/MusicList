import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Song} from '../models/song';
import {catchError, tap} from 'rxjs/operators';

import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  // private songUrl = 'https://localhost:5001/api/songs';
  private songUrl = 'https://musiclistapi.azurewebsites.net/api/songs';
  private categoryUrl = 'https://musiclistapi.azurewebsites.net/api/categories';


  constructor(public http: HttpClient) {
  }


  /*   HARD CODED LIST
  catList: Category[] = [
     {id: 1, name: 'Folk'},
     {id: 2, name: 'Sevdah'},
     {id: 3, name: 'Rock'}
   ];

   getCatList(): Category[] {
     return this.catList;
   }*/

  getSongList(): Observable<Song[]> {
    return this.http.get<Song[]>(this.songUrl)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  getSongsByCategory(categoryId: number | any): Observable<Song[]> {
    return this.http.get<Song[]>(this.categoryUrl + `/${categoryId}/songs`)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  saveSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.songUrl, song)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  saveCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.categoryUrl, category)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err)));
  }

  deleteSong(id: number): Observable<Song> {
    return this.http.delete<Song>(this.songUrl + `/${id}`)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  updateSong(id: number | any, song: Song): Observable<Song> {
    return this.http.put<Song>(this.songUrl + `/${id}`, song)
      .pipe(
        tap(data => console.log(data)),
        catchError((err) => throwError(err))
      );
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(this.songUrl + `/${id}`);
  }

}

