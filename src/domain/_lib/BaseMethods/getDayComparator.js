export const getDayComparator = (orderBy = 'asc') => {
  return (a, b) => {
    switch (orderBy) {
      case 'desc':
        return a.day < b.day;
      default:
        return a.day > b.day;
    }
  };
};
