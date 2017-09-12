class ChartRepository extends Container
{
    
    constructor()
    {
        super();
     // var chartNames = ["Bar", "Pie", "Line", "Stacked", "Doughnut"];
    }

    getIterator()
    {
        return new ChartRepository.ChartIterator();
    }
    
    
}

ChartRepository.ChartIterator = class ChartIterator extends Iterator {
    constructor() {
        super();
        this.index = 0;
   this.chartNames = ["Bar", "Pie", "Line", "Stack", "Doughnut"];
   this.len = this.chartNames.length;
    }


    hasNext() {
       //onsole.log(this.index);
       //onsole.log(this.len);
        if (this.index < this.len){
            return true;
        }
        else {
            return false;
        }
       

    }

    next() {
        if (this.hasNext()) {
return this.chartNames[this.index++];
        }
        else {
            return null;
        }
        
    }
}