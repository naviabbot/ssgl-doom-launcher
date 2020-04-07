import fuzz from 'fuzzysearch';

const sortList = (arr, sort, filter, filterCallback) => {
  const srt = () => {
    switch (sort) {
      case 'asc':
        return arr.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });
      case 'desc':
        return arr.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
          return 0;
        });
      case 'new':
        return arr.sort((a, b) => b.created - a.created);
      case 'old':
        return arr.sort((a, b) => a.created - b.created);
      case 'active':
        return arr.sort((a, b) => b.active - a.active);
      case 'last':
        return arr.sort((a, b) => b.lastplayed - a.lastplayed);
      default:
        return arr;
    }
  };

  if (arr.length) {
    let show = srt();
    return filter.trim() !== ''
      ? show.filter(i => filterCallback(i, fuzz))
      : show;
  }

  return [];
};

export default sortList;
