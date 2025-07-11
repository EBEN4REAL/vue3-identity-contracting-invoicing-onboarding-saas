type Sort = {
  key: string;
  order: string;
};

export type Pagination = {
  page: number;
  itemsPerPage: number;
  sortBy?: Sort[];
};

export const itemsPerPageDefault: number = 10;

export const itemsPerPageOptions: number[] = [10, 25, 50, 100];
