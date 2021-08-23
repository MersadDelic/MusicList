import {Component, OnInit} from '@angular/core';
import {Song} from '../models/song';
import {SongService} from '../services/song.service';
import {Category} from '../models/category';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
  SongFormGroup: FormGroup;
  CategoryFormGroup: FormGroup;
  heading: string;
  showSaveButton: boolean;
  showUpdateButton: boolean;
  alert = false;
  message: string;
  songTitleFilter = '';

  constructor(public songService: SongService) {
    this.SongFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      artist: new FormControl('', [Validators.required, Validators.minLength(2)]),
      categoryId: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required])
    });

    this.CategoryFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
  }

  // Specific way of VALIDATION FORM FOR URL & CATEGORYiD //
  get url(): any {
    return this.SongFormGroup.get('url');
  }

  get categoryId(): any {
    return this.SongFormGroup.get('categoryId');
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
    this.song.title = this.SongFormGroup.value.title;
    this.song.artist = this.SongFormGroup.value.artist;
    this.song.categoryId = this.SongFormGroup.value.categoryId;
    this.song.url = this.SongFormGroup.value.url;
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
    this.SongFormGroup.controls.title.setValue(song.title);
    this.SongFormGroup.controls.artist.setValue(song.artist);
    this.SongFormGroup.controls.url.setValue(song.url);
    this.SongFormGroup.controls.categoryId.setValue(song.categoryId);
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
    this.song.title = this.SongFormGroup.value.title;
    this.song.artist = this.SongFormGroup.value.artist;
    this.song.categoryId = this.SongFormGroup.value.categoryId;
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
    this.category.name = this.CategoryFormGroup.value.name;
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

  // <---------------- Filter by song title(old)  ------------------------->

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
    this.CategoryFormGroup.reset();
  }

  resetSongForm(): void {
    this.SongFormGroup.reset();
  }
}


