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

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

navigator.getUserMedia({audio: true}, stream => {
  const audioContext = new AudioContext()
  let source = audioContext.createMediaStreamSource(stream)
  let analyser = audioContext.createAnalyser()
  let frequencyData = new Uint8Array(analyser.frequencyBinCount)
  let timeDomainData = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  setInterval(
    () => {
      analyser.getByteFrequencyData(frequencyData)
      analyser.getByteTimeDomainData(timeDomainData)
      const sum = frequencyData.reduce((sum, v) => sum + v, 0)
      const pt = sum / analyser.frequencyBinCount
      data.push(pt)
      if (data.length > 500) {
        data.shift()
        data.shift()
      }
      document.getElementById('player').style.bottom = (pt * 100 / 150) + '%'
      series.setData(data, true)
    }, 10
  )
}, () => {
})
