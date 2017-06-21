var moment=require('moment');

var getrand =function(){
   var dt=new moment();
   var formatdt=dt.format('YYYYMMDDHHmmss'); //格式化输出
   var rd=Math.floor(Math.random() * ( 10000 + 1));
   return (formatdt+rd);
};

exports.getRand =getrand;
