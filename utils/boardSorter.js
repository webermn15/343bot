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

// [ 
//   { username: 'webs',
//     emoji: '<:OSFrog:230491442336759809>',
//     seconds_left: [ 18, 53, 8, 55, 55, 55 ],
//     success: 6,
//     true_post: 1 },
//   { username: 'Puff',
//     emoji: null,
//     seconds_left: [ 58, 50, 59, 56, 58, 58 ],
//     success: 6,
//     true_post: 0 },
//   { username: 'Ding',
//     emoji: '<a:dingif:537067206220054539>',
//     seconds_left: [ 13, 12, 2, 1, 1, 1, 1, 1, 1, 1 ],
//     success: 10,
//     true_post: 0 }
// ]

// user.seconds_left.length > 0 ? roundResult(user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length)