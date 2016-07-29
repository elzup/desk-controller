'use strict'
const axios = require('axios')
const Highcharts = require('highcharts')

let chart, series
const data = Array.from(Array(500), x => 0)
let generation = 0

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
      game(pt)
      series.setData(data, true)
    }, 10
  )
}, () => {
})

const pointItems = []

let game = pt => {
  const $game = document.getElementById('game')
  const $player = document.getElementById('player')
  $player.style.bottom = (pt * 3.4) + 'px'
  const playerBounds = $player.getBoundingClientRect()
  generation += 1
  if (generation === 60) {
    // ボーナスアイテム生成
    generation = 0
    const $div = document.createElement('div')
    $div.setAttribute('class', 'point')
    $div.style.top = ['10%', '40%', '75%'][Math.floor(Math.random() * 3)]
    $div.setAttribute('x', 0)
    $div.style.right = $div.getAttribute('x')
    $game.appendChild($div)
    pointItems.push($div)
  }
  for (let i in pointItems) {
    let item = pointItems[i]
    let newX = parseInt(item.getAttribute('x')) + 2
    let bounds = item.getBoundingClientRect()
    if (boundingCollision(playerBounds, bounds) || bounds.left + window.pageXOffset < 0) {
      $game.removeChild(item)
      pointItems.splice(i, 1)
      continue
    }
    item.setAttribute('x', newX)
    item.style.right = newX + 'px'
  }
}

const boundingCollision = (bound1, bound2) => {
  let cx1 = (bound1.left + bound1.right) / 2
  let cy1 = (bound1.top + bound1.bottom) / 2
  let cx2 = (bound2.left + bound2.right) / 2
  let cy2 = (bound2.top + bound2.bottom) / 2
  let dx = cx1 - cx2
  let dy = cy1 - cy2
  return 50 * 50 > dx * dx + dy * dy
}
