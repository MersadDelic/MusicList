export class Song {
  id?: number;
  title: string;
  artist: string;
  url?: string;
  rating?: number;
  isFavourite?: boolean;
  createdTime?: string;
  modifiedTime?: string;
  categoryId?: any;

  constructor()  {
    this.categoryId  = {    };
  }
}
