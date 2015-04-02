#!/usr/bin/env node
var minimist = require('minimist')
var wifiStatus = require('./')
var log = require('single-line-log').stdout

var argv = minimist(process.argv.splice(2))

function start () {
  wifiStatus(argv, function (status) {
    log(status + '\n')
    if (argv.live || argv.l) {
      log.clear()
      setTimeout(start, 500)
    }
  })
}

start()
