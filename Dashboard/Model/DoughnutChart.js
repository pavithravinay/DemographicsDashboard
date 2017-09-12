class DoughnutChart extends ConfiguredChart {
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
        var data = {
            labels: label,
            datasets: [
                {
                    label: this.chartLabel,
                    data: chartData,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
        };

        var myPieChart = new Chart(this.ctx, {
            type: 'doughnut',
            data: data
        });

        $("#doughnutHeading").text("Doughnut Chart");
    }
}
