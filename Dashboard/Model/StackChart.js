class StackChart extends ConfiguredChart {
    constructor(ctx, label, chartData, chartLabel, zchartData, zColumn) {
        super(label);
        this.ctx = ctx;
        this.label = label;
        this.chartData = chartData;
        this.chartLabel = chartLabel;
        this.zChartData = zchartData;
        this.zColoumn = zColumn;
    }

    getBackgroundColor(items) {
        var backgroundColors = [];
        for (var i in items) {
            backgroundColors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
        }
        return backgroundColors;
    }

    drawChart() {
        var myDatasets = [];
        for (var data in this.zChartData) {
            var dataOptions = {
                label: this.zColoumn[data],
                data: this.zChartData[data],
                backgroundColor: this.getBackgroundColor(this.zChartData[data]),
                hoverBackgroundColor: this.getBackgroundColor(this.zChartData[data])
            }
            myDatasets.push(dataOptions);
        }

        var data = {
            labels: this.label,
            datasets: myDatasets              
        };

        var options = {
            scales: {
                xAxes: [{
                    barPercentage: .6,
                    categoryPercentage: 0.5
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        };

        var demographicsStackedChart = new Chart(this.ctx, {
            type: 'bar',
            data: data,
            options:options
        });

        $("#stackHeading").text("Stacked Chart");

    }
}
