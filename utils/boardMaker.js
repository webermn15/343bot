module.exports = boardMaker = arr => {
	return arr.reduce((acc, curr) => {
  let exists = acc.findIndex(record => record.username === curr.username);
  if (exists < 0) {
    acc.push(curr);
  }
  else {
    acc[exists].success += 1;
    acc[exists].true_post += curr.true_post;
  }
  return acc;
}, []);
}