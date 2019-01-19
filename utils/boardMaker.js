module.exports = boardMaker = arr => {
	return arr.reduce((acc, curr) => {
	  let exists = acc.findIndex(record => record.username === curr.username);
	  if (exists < 0) {
	  	curr.seconds_left = [curr.seconds_left];
	    acc.push(curr);
	  }
	  else {
	  	acc[exists].seconds_left.push(curr.seconds_left);
	    acc[exists].success += 1;
	    acc[exists].true_post += curr.true_post;
	  }
	  return acc;
	}, []);
}