var spawn = require('child_process').spawn
var split = require('split')
var chalk = require('chalk')

var airport = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
var data = {}

// RSSI: 0 good, -100 bad
// agrCtlNoise Low as possible (-100?)

module.exports = function (opts, cb) {
  spawn(airport, ['-I']).stdout
    .pipe(split())
    .on('data', function (line) {
      var info = line.trim().split(': ')
      if (info.length === 2) data[info[0]] = info[1]
    })
    .on('end', function () {
      if (data.AirPort === 'Off') return cb(chalk.red('Wifi off.'))
      var rssi = Number(data.agrCtlRSSI)
      var noise = Number(data.agrCtlNoise)
      if (opts.raw) return cb(data)
      if (!data.SSID) return cb(chalk.red('Not connected.'))
      cb([
        data.SSID + ' ' + (data['link auth'] === 'none' ? '🔓' : '🔒'),
        createBar('WiFi Signal:\t', 100 + rssi, 'green'),
        createBar('WiFi Noise:\t', 100 + noise, 'red')
      ].join('\n'))
    })

  function createBar (text, percent, color) {
    var length = Math.floor(percent / 5)
    var bar = chalk[color]('[' + Array(length).join('|'), Array(20 - length).join(' ') + ']')
    return [text, bar, percent].join(' ')
  }
}
