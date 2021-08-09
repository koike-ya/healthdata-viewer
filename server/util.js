
function calculateURLQueryDates(start, end, oldest, newest) {
  [start, end, oldest, newest] = [parseDate(start), parseDate(end), parseDate(oldest), parseDate(newest)]
  const queryList = []

  if (oldest <= start && newest < end) {
    queryList.push([newest.addDays(1), end])
  } else if (oldest <= start && newest >= end) {
  } else if (oldest < end && newest < end) {
    queryList.push([start, oldest.addDays(-1)])
    queryList.push([newest.addDays(1), end])
  } else if (newest >= end) {
    queryList.push([start, oldest.addDays(-1)])
  } 

  queryList.forEach( (queryPair) =>{
    queryPair[0] = formatDate(queryPair[0])
    queryPair[1] = formatDate(queryPair[1])
  })

  return queryList
}

function parseDate(dateString) {
  const year = parseInt(dateString.slice(0, 4));
  const month = parseInt(dateString.slice(5, 7));
  const day = parseInt(dateString.slice(8, 10));
  return new Date(year, month - 1, day)
}

function formatDate(dt) {
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return (y + '-' + m + '-' + d)
}

Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

module.exports = {
  calculateURLQueryDates,
  parseDate,
  formatDate
}