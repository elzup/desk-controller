'use strict'
var $ = require('jquery')
var Highcharts = require('highcharts')

var chart, data, series

$(function () {
  data = new Array(500)
  for (var i = 0; i < 500; ++i) {
    data[i] = 0
  }

  var fetchJSON = function (url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url)
        .done((json) => resolve(json))
        .fail((xhr, status, err) => reject(status + err.message));
    })
  }

  chart = new Highcharts.Chart(fetchJSON('/highchart-config.json'))
  series = chart.series[0]
  series.setData(data, true)
  var am = new AudioManager({
    useMicrophone: true,
    onEnterFrame: function () {
      // avg of 1024 data
      data.push(Utils.sum(this.analysers.mic.getByteFrequencyData()) / 1024)
      if (chart == null) {
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
})
