type TPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};
const pagination = (paginationOptions: TPaginationOptions) => {
  const { page, limit, sortBy, sortOrder } = paginationOptions;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const sortWith = sortBy || "createdAt";
  const sortSequence = sortOrder || "asc";

  return {
    pageNumber,
    limitNumber,
    skip,
    sortWith,
    sortSequence,
  };
};

export default pagination;
