class LineChart extends ConfiguredChart {
    constructor(ctx, label, chartData, chartLabel) {
        super(label);
        this.ctx = ctx;
        this.label = label;
        this.chartData = chartData;
        this.chartLabel = chartLabel;
    }

    drawChart() {
       
        var data = {
            labels: this.label,
            datasets: [
                {
                    label: this.chartLabel,
                    data: this.chartData,
                    backgroundColor: this.backgroundColor,
                    hoverBackgroundColor: this.hoverBackgroundColor
                }]
        };

        var myPieChart = new Chart(this.ctx, {
            type: 'line',
            data: data
        });

        $("#lineHeading").text("Line Chart");

    }
}
