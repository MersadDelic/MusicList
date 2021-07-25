import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Song} from '../models/song';
import {SongService} from '../services/song.service';
import {Category} from '../models/category';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  constructor(public songService: SongService,
  ) {
  }

  song: Song = new Song();
  songList: Song[] = [];
  categoryList: Category[];
  category: Category = new Category();
  selectedCategory: number;

  title: any;
  artist: any;
  key = 'title';
  reverse = false;

  categoryListData: Category[] = [
    {id: 1, name: 'folk'},
    {id: 2, name: 'pop'},
    {id: 3, name: 'sevdah'},

  ];

  ngOnInit(): void {
    this.getSongs();
    this.getCategories();
  }

  getSongs(): void {
    this.songService.getSongList()
      .subscribe(res => {
          this.songList = res;
        },
        error1 => console.log(error1)
      );
  }

  saveSong(): any {
    //  this.song.category = this.category;
    this.songService.saveSong(this.song).subscribe(
      createdSong => {
        this.songList.push(createdSong);
      },
      err => console.log(err));
  }

  saveCategory(): void {
    this.songService.saveCategory(this.category).subscribe(
      createdCategory => this.categoryList.push(createdCategory),
      error => console.log(error));
  }

  getCategories(): Category[] {
  return this.categoryListData;
  }


  /*deleteBook(id: number): void {
    if (confirm('Are you sure to delete this book ?')) {
      this.bookService.deleteBook(id)
        .subscribe(res => {
            this.bookList = this.bookList.filter(item => item.id !== id);
            console.log('obrisana knjiga');
          },
          err => console.log(err));
    }
  }
*/

  onSearchClear(): void {
    this.title = ' ';
    this.Search();
  }

  Search(): void {
    if (this.title === '') {
      this.ngOnInit();
    } else {
      this.songList = this.songList.filter(res => {
        return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
      });
    }
  }

}

