export const getDayComparator = (
  orderBy = 'asc',
  dayExtructor = (day) => day
) => {
  return (a, b) => {
    const dayA = dayExtructor(a);
    const dayB = dayExtructor(b);

    return orderBy === 'asc' ? dayA - dayB : dayB - dayA;
  };
};
