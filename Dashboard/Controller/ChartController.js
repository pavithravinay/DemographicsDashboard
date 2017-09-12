// JavaScript source code
class ChartController {

    constructor(filterCriteria, datasetProperties, demographicsDf) {
        this._filterCriteria = filterCriteria;
        this._datasetProperties = datasetProperties;
        this._demographicsDf = demographicsDf;
    }

    applyCharts() {
        //Display menu to the user to choose x-axis and y-axis columns
        $("#ChartCriteria").removeClass("hidden");

        var filterCriteria = this._filterCriteria;
        var filterKeys = Object.keys(filterCriteria);
        var datasetProperties = this._datasetProperties;
        var datasetKeys = Object.keys(datasetProperties);

        var xAxis = [];
        var yAxis = [];
        for (var col in filterKeys) {
            for (var column in datasetKeys) {
                if (filterKeys[col] === datasetKeys[column]) {
                    if (datasetProperties[datasetKeys[column]].dimension.search("x") >= 0) {
                        xAxis.push(filterKeys[col]);
                    }
                    if (datasetProperties[datasetKeys[column]].dimension.search("y") >= 0) {
                        yAxis.push(filterKeys[col]);
                    }
                }
            }
        }
        //populate drop downs
        var xList = "<option></option>";
        var yList = "<option></option>";
        for (var xCols in xAxis) {
            xList += "<option>" + xAxis[xCols] + "</option>";
        }
        for (var yCols in yAxis) {
            yList += "<option>" + yAxis[yCols] + "</option>";
        }

        $("#xAxisSelect").empty();
        $("#yAxisSelect").empty();
        $("#zAxisSelect").empty();

        $("#xAxisSelect").append(xList);
        $("#yAxisSelect").append(yList);
        $("#zAxisSelect").append(xList);
    }

    //Draw selected charts
    drawChart() {

        var df = this._demographicsDf.getFilteredDataframe();

        var labelColumn = $("#xAxisSelect option:selected").text();
        var dataColumn = $("#yAxisSelect option:selected").text();
        var zColumn = $("#zAxisSelect option:selected").text();

        var chartLabels = df.distinct(labelColumn).toArray();
        var chartDataGroup2D, chartDataGroup3D;

        if (this._datasetProperties[dataColumn].groupBy === "sum") {
            chartDataGroup2D = df.groupBy(labelColumn).aggregate(group => group.stat.sum(dataColumn)).toArray();
            if(zColumn!="")
                chartDataGroup3D = df.groupBy(labelColumn, zColumn).aggregate(group => group.stat.sum(dataColumn)).toArray();
        }
        else {
            chartDataGroup2D = df.groupBy(labelColumn).aggregate(group => group.count(dataColumn)).toArray();
            if (zColumn != "")
                chartDataGroup3D = df.groupBy(labelColumn, zColumn).aggregate(group => group.count(dataColumn)).toArray();
        }        

        var zLabels = df.distinct(zColumn).toArray();
        var chartData = [];
        var zchartData = [];

        for (var item in chartDataGroup2D) {
            chartData.push(chartDataGroup2D[item][1]);
        }

        var stackArray = [];
        for (let i = 0; i < 2; i++) {
            stackArray[i] = [];
        }
        for (var item in chartDataGroup3D) {
            if (chartDataGroup3D[item][1] == zLabels[0]) {
                stackArray[0].push(chartDataGroup3D[item][2]);
            }
            else {
                stackArray[1].push(chartDataGroup3D[item][2]);
            }
        }

        var factory = new ChartFactory();

        var chartNames = [];
        $("#checkboxes").children("input:checked").map(function () {
            chartNames.push({ id: this.id, name: this.name })
        });

        for (var i = 0; i < chartNames.length; i++) {
            var name = chartNames[i]['name']
            var chart = factory.getChart(name.toUpperCase(),
                                        document.getElementById(name.toLowerCase() + "Area"),
                                        chartLabels,
                                        chartData,                                        
                                        labelColumn,
                                        stackArray,
                                        zLabels
                                        );
            chart.drawChart();
        }
    }

    chooseChart() {

        var label = this.labelArray;
        var chartData = this.dataArray;
        var factory = new ChartFactory();

        for (var i = 0; i < this.chartNames.length; i++) {
            var name = this.chartNames[i]['name']
            var chart = factory.getChart(name.toUpperCase(), document.getElementById(name.toLowerCase() + "Area"), label, chartData);
            chart.drawChart();
        }
    }

    displayChartCriteria(filterCriteria, fileProperties) {

    }
}
