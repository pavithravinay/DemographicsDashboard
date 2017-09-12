class ChartDecorator {
    constructor()
    {

    }

    getColors()
    {
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        return color;
    }
}