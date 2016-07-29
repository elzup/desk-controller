'use strict'
const axios = require('axios')
const Highcharts = require('highcharts')

let chart, series

let data = Array.from(Array(500), x => 0)

axios.get('/highchart-config.json').then(response => {
  chart = new Highcharts.Chart(response.data)
  series = chart.series[0]
  series.setData(data, true)
})

let am = new AudioManager({
  useMicrophone: true,
  onEnterFrame: function () {
    // avg of 1024 data
    data.push(Utils.sum(this.analysers.mic.getByteFrequencyData()) / 1024)
    if (!chart) {
      return
    }
    // NOTE: length が変わらないと redraw が効かないので 2つずつ 変動させている
    // 500 data Queue
    if (data.length > 500) {
      data.shift()
      data.shift()
    }
    series.setData(data, true)
  }
})
am.init()
