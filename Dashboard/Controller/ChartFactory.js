// JavaScript source code
class ChartFactory {
    constructor() {

    }

    getChart(type, ctx, label, chartData, chartLabel, stackArray,zLabels) {

        if (type === 'PIE') {
            var pieObj = new PieChart(ctx, label, chartData, chartLabel);
            return pieObj;
        }
        else if (type === 'BAR') {
            var barObj = new BarChart(ctx, label, chartData, chartLabel);
            return barObj;
        }
        else if (type === 'LINE') {
            var lineObj = new LineChart(ctx, label, chartData, chartLabel);
            return lineObj;
        }
        else if (type === 'DOUGHNUT') {
            var doughnutObj = new DoughnutChart(ctx, label, chartData, chartLabel);
            return doughnutObj;
        }
        else {
            var stackObj = new StackChart(ctx, label, chartData, chartLabel, stackArray,zLabels);
            return stackObj;
        }
    }


}
