export interface IOptions {
  page?: string | number;
  limit?: string | number;
  skip?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return { page, limit, skip, sortBy, sortOrder };
};

export const PaginationHelper = {
  calculatePagination,
};
