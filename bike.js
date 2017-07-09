const rpio = require('rpio');
const Lcd = require('lcd');

const lcd = new Lcd({
  rs: 12,
  e: 21,
  data: [5, 6, 17, 18],
  cols: 16,
  rows: 2,
});


let count = 0;
let totalDist = 0;
let delta = 0;
let totalTime = 0;

let idleTimer;
let prevTime = Date.now();
let curTime = Date.now();
const revDistance = 4167;
const revDev = 1000000;
const calcDistance = revDistance / revDev;
let stopped = false;

function resetTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print('Stopped!');
    stopped = true;
  }, 2500);
}


lcd.on('ready', () => {
  rpio.open(37, rpio.INPUT, rpio.PULL_DOWN);
  resetTimer();

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
      count += 1;
      totalDist += revDistance;
      totalTime += delta;

      const date = new Date(totalTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const instHours = (delta / (1000 * 60 * 60));

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(`Miles: ${(totalDist / 1000000).toFixed(4)}`);

      lcd.once('printed', () => {
        lcd.setCursor(0, 1);
        if (count % 5) {
          lcd.print(`Time:  ${hours}:${minutes}:${seconds}`);
        } else {
          lcd.print(`MPH:   ${(calcDistance / instHours).toFixed(2)}`);
        }
      });

      resetTimer();
    }
    prevTime = curTime;
  }
  rpio.poll(37, pollcb);
});

process.on('SIGINT', () => {
  rpio.close(37);
  lcd.clear();
  lcd.close();
  process.exit();
});
