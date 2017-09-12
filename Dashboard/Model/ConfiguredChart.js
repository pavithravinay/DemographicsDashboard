// JavaScript source code
class ConfiguredChart extends MyChart{
    constructor(label)
    {
        super();
        this.backgroundColor = [];
        this.hoverBackgroundColor = [];
        this.zBackGroundColor = [];
        this.chartDecorator = new ChartDecorator();
        for (var col in label) {
            this.backgroundColor.push(this.chartDecorator.getColors());
        }
        this.hoverBackgroundColor = this.backgroundColor;
    }
}