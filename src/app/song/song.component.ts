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
  selectedCategory: Category;  // selektovana kategorija
  title: any;
  artist: any;

  ngOnInit(): void {

    // ako je selektovana kategorija vrati pjesme za tu kategoriju
    // ako nije selektovana kategorija(prvi ulazak na stranicu), vrati sve pjesme

    if (this.selectedCategory) {
      this.getSongsBySelectedCategory(this.selectedCategory.id);
    } else {
      this.getAllSongs();
    }
    this.getCategories();
  }

  getSongsBySelectedCategory(categoryId: number | any): void {
    this.songService.getSongsByCategory(categoryId)
      .subscribe(res => {
          this.songList = res;
        },
        error1 => console.log(error1)
      );
  }

  getAllSongs(): void {
    this.songService.getSongList()
      .subscribe(res => {
          this.songList = res;
        },
        error1 => console.log(error1)
      );
  }


  saveSong(): any {
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


  deleteSong(id: number): void {
    {
      this.songService.deleteSong(id)
        .subscribe(res => {
            this.songList = this.songList.filter(song => song.id !== id);
            console.log('obrisana pjesma');
          },
          err => console.log(err));
    }
  }


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

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.getSongsBySelectedCategory(category.id);
  }


  clearSelected(): void {
    this.getAllSongs();
  }

}

