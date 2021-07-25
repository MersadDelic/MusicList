import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Song} from '../models/song';
import {SongService} from '../services/song.service';
import {Category} from '../models/category';

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
  categoryList: Category[] = [];
  category: Category = new Category();
  selectedCategoryType: Category;

  title: any;
  artist: any;
  key = 'title';
  reverse = false;

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

  getCategories(): void {
    this.songService.getCategories().subscribe(
      res => {
        this.categoryList = res;
      },
      error => console.log(error)
    );
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
    if ( this.title === '') {
      this.ngOnInit();
    } else {
      this.songList = this.songList.filter(res => {
      return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
    });
  }
  }

  selectedCategory(type: Category): void {
      this.selectedCategoryType = type;
      console.log('kliknuto');


  }

}

