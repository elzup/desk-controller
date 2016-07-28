var manager, chart, data;

$(function () {
    data = new Array(500);
    for (var i=0; i < 500; ++i) {
        data[i] = 0;
    }
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            zoomType: 'x'
        },
        title: {
            text: 'Concrete Traffic'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Exchange rate(dB)'
            },
            max: 150,
            min: 0
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'USD to EUR',
            data: data
        }]
    });

    manager = (new AudioManager({
        useMicrophone   : true,
        onEnterFrame    : function() {
            // avg of 1024 data
            data.push(Utils.sum(this.analysers.mic.getByteFrequencyData()) / 1024);
            if (chart == null) {
                return;
            }
            // NOTE: length が変わらないと redraw が効かないので 2つずつ 変動させている
            // 500 data Queue
            if (data.length > 500) {
                data.shift();
                data.shift();
            }
            chart.series[0].setData(data, true);
        }
    })).init();
});
