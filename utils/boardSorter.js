module.exports = boardSorter = (formattedBoardArray) => {
	return formattedBoardArray.sort((a, b) => {
    if (a.success > b.success) return -1;
    if (a.success === b.success) { 
      const secondsA = a.seconds_left.reduce((x, y) => x + y) / a.seconds_left.length
      const secondsB = b.seconds_left.reduce((x, y) => x + y) / b.seconds_left.length
      if (secondsA > secondsB) return -1;
      if (secondsA === secondsB) return 0;
      if (secondsA < secondsB) return 1;
    }
    if (a.success < b.success) return 1;
	});
}