export function paginateResponse(data, page, perPage, total) {
  const lastPage = perPage > 0 ? Math.ceil(total / perPage) : 0;
  return {
    current_page: page,
    last_page: lastPage,
    total,
    per_page: perPage,
    data,
  };
}
