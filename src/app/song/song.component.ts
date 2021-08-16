import {Component, OnInit} from '@angular/core';
import {Song} from '../models/song';
import {SongService} from '../services/song.service';
import {Category} from '../models/category';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  song: Song = new Song();
  songList: Song[] = [];
  categoryList: Category[] = [];
  category: Category = new Category();
  selectedCategory: Category;
  artist: any;
  formGroup: FormGroup;
  heading: string;
  showSaveButton: boolean;
  showUpdateButton: boolean;
  alert = false;
  message: string;
  songTitleFilter: string = '';

  constructor(public songService: SongService) {

    this.formGroup = new FormGroup({
      title: new FormControl(null),
      artist: new FormControl(null),
      categoryId: new FormControl(null)
    });
  }


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
        this.alert = true;
        this.message = 'Successfully added new song !';
        setTimeout(() => {
          this.alert = false;
        }, 3000);
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
        this.getAllSongs();
        this.alert = true;
        this.message = 'Successfully updated song !';
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      },
      error => console.log(error)
    );
  }

  saveCategory(): void {
    this.songService.saveCategory(this.category).subscribe(
      createdCategory => {
        this.categoryList.push(createdCategory);
        this.alert = true;
        this.message = 'Successfully added new category !';
        setTimeout(() => {
          this.alert = false;
        }, 3000);
        this.resetCategoryForm();
      },
      error => console.log(error));
  }

  getCategories(): void {
    this.songService.getCategories().subscribe(
      res => {
        this.categoryList = res;
        this.getSortedCategories(this.categoryList);
      },
      error => console.log(error)
    );
  }

  public getSortedCategories(category: Category[]): Category[] {
    return category.sort((a: Category, b: Category) => {
      return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
    });
  }

  deleteSong(id: number | any): void {
    {
      this.songService.deleteSong(id)
        .subscribe(res => {
            this.alert = true;
            this.message = 'Successfully deleted song !';
            setTimeout(() => {
              this.alert = false;
            }, 3000);
            this.songList = this.songList.filter(item => item.id !== id);
          },
          err => console.log(err));
    }
  }

  // Filter by song title (old) ---------------------------->
  /*  onSearchClear(): void {
      this.title = '';
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
    }*/

  // <---------------- Filter by song title  ------------------------->

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.getSongsBySelectedCategory(category.id);
  }

  clearSelected(): void {
    this.ngOnInit();
    this.getAllSongs();
    this.songTitleFilter = '';
  }

  resetCategoryForm(): void {
    this.category.name = '';
  }

  resetSongForm(): void {
    this.formGroup.reset(FormControl);
  }

}


