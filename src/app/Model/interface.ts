export interface ImageItem {
  url: string;
}

export type GALLERY = ImageItem;
export type HOME = ImageItem;
export type IMAGELST = ImageItem;
export type TILES = ImageItem;

export interface CARDS {
  id?: string;
  url: string;
  likeCnt: number;
  des: string;
  tooltip?: string;
  color: string;
}
