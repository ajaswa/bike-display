# bike-display

Display for my DeskCycle underdesk bike.

## Parts
- Raspberry Pi 3
- 16x2 lcd (https://www.sparkfun.com/products/9052)
- 1kOhm resister
- 1kOhm Potentiometer
- Bits of wire
- DeskCycle (http://www.deskcycle.com)

## Details
The deskcycle has two "data" ports, 3.5mm headphone jack and plug. This is essenetially a connetor to a magent switch attached to a fly wheel inside the device. Using their calorie calculator, some basic counting and their display, it wasn't hard to sort out that by their measurements 24 complete revolutions equaled `0.1` miles. The actual accuracy of this can't be verifed right now, I suspect based on their MPG calculations this might be wildly off. That said my display matches up with one shipped with the DeskCycle.
