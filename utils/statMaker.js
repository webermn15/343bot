module.exports = statMaker = arr => {
	return arr.reduce((acc, curr) => {
    let exists = acc.findIndex(record => record.username === curr.username);
    if (exists < 0) {
      if (curr.success) {
        curr.seconds_left = [curr.seconds_left];
        curr.seconds_missed = []
        curr.failed = 0;
      }
      else {
        curr.seconds_missed = [curr.seconds_left];
        curr.seconds_left = [];
        curr.failed = 1;
      }
      acc.push(curr);
    }
    else {
      if (curr.success) {
        acc[exists].seconds_left.push(curr.seconds_left);
        acc[exists].success += 1;
        acc[exists].true_post += curr.true_post;
      }
      else {
        acc[exists].seconds_missed.push(curr.seconds_left);
        acc[exists].failed += 1;
      }
    }
    return acc;
  }, []);
}