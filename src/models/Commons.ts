export interface IBaseItems {
  ide: number;
  title: string;
  image: string;
  price: number;
  link: string;
}

export interface ISearchItem {
  searchQuery: string;
  locations: string[];
}

export interface IResponseItems {
  items: IBaseItems[];
  quantity: number;
  query: string;
  locations: string[];
}
