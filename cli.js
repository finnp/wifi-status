#!/usr/bin/env node
var spawn = require('child_process').spawn
var split = require('split')
var chalk = require('chalk')
var minimist = require('minimist')

var argv = minimist(process.argv.splice(2))

var airport = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'

var data = {}


spawn(airport, ['-I']).stdout
  .pipe(split())
  .on('data', function (line) {
    var info = line.trim().split(': ')
    if(info.length === 2)
    data[info[0]] = info[1]
  })
  .on('end',function () {
    var rssi = Number(data.agrCtlRSSI)
    var noise = Number(data.agrCtlNoise)
    if(argv.raw) return console.log(data)
    console.log(data.SSID, data['link auth'] === 'none' ? '🔓' : '🔒')
    bar('WiFi Signal:\t', 100 + rssi)
    bar('WiFi Noise:\t', 100 + noise)
  })
  
function bar(text, percent) {
  var length = Math.floor(percent/5)
  var bar = chalk.green('[' + Array(length).join('|'),  Array(20 - length).join(' ') + ']')
  console.log(text, bar, percent)
}

// RSSI: 0 good, -100 bad
// agrCtlNoise Low as possible (-100?)