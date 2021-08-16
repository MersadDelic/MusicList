import {Pipe, PipeTransform} from '@angular/core';
import {Song} from '../models/song';

@Pipe({
  name: 'songFilterByTitle'
})
export class SongFilterByTitlePipe implements PipeTransform {

  transform(songList: Song[], search: string): Song[] {
    if (!search.trim()) {
      return songList;
    }

    return songList.filter(song => {
      return song.title.toString().toLowerCase()
        .includes(search.toLowerCase());
    });
  }

}
