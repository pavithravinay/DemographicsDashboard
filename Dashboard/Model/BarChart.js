class BarChart extends ConfiguredChart {

    constructor(ctx, label, chartData, chartLabel) {
        super(label);
        this.ctx = ctx;
        this.label = label;
        this.chartData = chartData;
        this.chartLabel = chartLabel;
    }

    drawChart() {

        var label = this.label;
        var chartData = this.chartData;
        var backgroundColor = this.backgroundColor;
        var hoverBackgroundColor = this.hoverBackgroundColor;
        var options= {
                scales: {
                    xAxes: [{
                        barPercentage: .6,
                        categoryPercentage:0.5
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
        };
        var data = {
            labels: label,
            datasets: [
                {
                    label:this.chartLabel,
                    data: chartData,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]            
        };


        var demographicsBarChart = new Chart(this.ctx, {
            type: 'bar',
            data: data,
            options:options
        });

        $("#barHeading").text("Bar Chart");

    }
}
