import {Component, OnInit} from '@angular/core';
import {Song} from '../models/song';
import {SongService} from '../services/song.service';
import {Category} from '../models/category';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  constructor(public songService: SongService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {

    this.formGroup = new FormGroup({
      title: new FormControl(null),
      artist: new FormControl(null),
      categoryId: new FormControl(null)
    });
  }

  song: Song = new Song();
  songList: Song[] = [];
  categoryList: Category[] = [];
  category: Category = new Category();
  selectedCategory: Category;
  title: any;
  artist: any;
  formGroup: FormGroup;
  heading: string;
  showSaveButton: boolean;
  showUpdateButton: boolean;


  ngOnInit(): void {

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

  saveSong(): void {
    this.song.title = this.formGroup.value.title;
    this.song.artist = this.formGroup.value.artist;
    this.song.categoryId = this.formGroup.value.categoryId;
    this.songService.saveSong(this.song).subscribe(
      res => {
        this.songList.push(res);
        this.resetSongForm();
      },
      error => console.log(error)
    );
  }

  onEdit(song: Song): void {
    this.editMode();
    console.log(song);
    this.songService.getSongById(song.id).subscribe(res => this.song = res);
    this.formGroup.controls.title.setValue(song.title);
    this.formGroup.controls.artist.setValue(song.artist);
    this.formGroup.controls.categoryId.setValue(song.categoryId);
  }

  addMode(): void {
    this.showSaveButton = true;
    this.showUpdateButton = false;
    this.heading = 'Add new song';
  }

  editMode(): void {
    this.showSaveButton = false;
    this.heading = 'Edit current song';
    this.showUpdateButton = true;
  }

  updateSong(): void {
    this.song.title = this.formGroup.value.title;
    this.song.artist = this.formGroup.value.artist;
    this.song.categoryId = this.formGroup.value.categoryId;
    this.songService.updateSong(this.song.id, this.song).subscribe(
      res => {
        console.log(res);
        window.location.reload();
      },
      error => console.log(error)
    );
  }

  saveCategory(): void {
    this.songService.saveCategory(this.category).subscribe(
      createdCategory => {
        this.categoryList.push(createdCategory);
        this.resetCategoryForm();
      },
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
    this.ngOnInit();
    this.getAllSongs();
  }

  resetCategoryForm(): void {
    this.category.name = '';
  }

  resetSongForm(): void {
    this.formGroup.reset(FormControl);
  }
}

