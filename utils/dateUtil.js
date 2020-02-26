
// 计算天数差
function DateDifference(Date1, Date2) { //Date1和Date2是2017-07-10格式  
  var sDate, newDate1, newDate2, Days
  var aDate = Date1.split("-");
  newDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为07-10-2017格式  
  aDate = Date2.split("-");
  newDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
  Days = parseInt(Math.abs(newDate1 - newDate2) / 1000 / 60 / 60 / 24); //把差的毫秒数转换为天数  
  return Days;
}
module.exports = {
  DateDifference
}