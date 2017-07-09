var rpio = require('rpio');
var Lcd = require('lcd');

var lcd = new Lcd({
    rs: 12,
    e: 21,
    data: [5, 6, 17, 18],
    cols: 16,
    rows: 2
  });

rpio.open(37, rpio.INPUT, rpio.PULL_DOWN);

var count=0;
var totalDist=0;
var delta=0;
var totalTime = 0;

var idleTimer;
var prevTime = Date.now();
var curTime = Date.now();
var revDistance = 4167;
var revDev = 1000000;
var calcDistance = revDistance/revDev;
var stopped = false;

function resetTimer(){
  clearTimeout(idleTimer);
  idleTimer = setTimeout(function(){
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print('Stopped!');
    stopped = true;
  }, 2500);
}

resetTimer();

lcd.on('ready', function() {
  function pollcb(pin) {
    if (rpio.read(pin)) {
      if (stopped) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print('Started!');
        stopped = false;
        prevTime = Date.now();
      }
      curTime = Date.now();
      delta = curTime - prevTime;
      count++;
      totalDist += revDistance;
      totalTime +=delta;
      
      var date = new Date(totalTime);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var instHours = (delta / (1000 * 60 * 60));
                  
//     console.log('rev:', count);

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print('Miles: '+(totalDist/1000000).toFixed(4));

      lcd.once('printed', function(){

        lcd.setCursor(0, 1);
        if (count % 5) {
          lcd.print('Time:  '+hours+':'+minutes+':'+seconds);
        } else {
          lcd.print('MPH:   '+ (calcDistance/instHours).toFixed(2));
        }
      });

      resetTimer();
    }
    prevTime=curTime;
  }
  rpio.poll(37, pollcb);

});
process.on('SIGINT', function() {
rpio.close(37);
  lcd.clear();
  lcd.close();
  process.exit();
});
