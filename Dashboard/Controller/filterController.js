// JavaScript source code

class filterController {

    constructor(dataframe, columnList, dataset) {
        this.df = dataframe;
        this.columnList = columnList;
        this._dataset = dataset;
    }

    getColumnList() {
        return this.columnList;
    }

    checkboxnames() {
        var arr = [];
        $("#append").children("input:checked").map(function () {
            arr.push({ id: this.id, name: this.name })
        });
        return arr;
    }

    displayUniqueRowValueFilters() {
        var columnList = this.columnList;
        var df = this.df;
        var parentThis = this;
        var myNode = document.getElementById('append');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var headingFilter = document.createElement('h3');
        headingFilter.textContent = "Select Filters";
        headingFilter.id = "selectFilterlbl";
        $("#selectFilter").after(headingFilter);

        var col = this.df.select(...columnList);
        
        //A json object to hold filter criteria chosen by the user.
        var filterList = {};
        var array = [];
        for (var col in columnList) {
            if ((this.df.distinct(columnList[col]).count()) <= 10) {
               
                filterList[columnList[col]] = [];
                filterList[columnList[col]] = this.df.distinct(columnList[col]).toArray();                               
            }
            else {
                filterList[columnList[col]] = [["All"]];                
            }
        }

        for (var filterCount in filterList) {            
            let columnLabel = "<h4 class='filterColName'><span class='label label-primary' >" + filterCount + "</span></h4>";
            $("#append").append(columnLabel);
            var filters = filterList[filterCount];
            filters.forEach(function (item, index, array) {
                item.forEach(function (it, ind, ar) {
                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.name = it;
                    checkbox.value = it;
                    checkbox.id = index;
                    checkbox.className = filterCount;
                    var label = document.createElement('label')
                    label.htmlFor = it;                    
                    label.appendChild(document.createTextNode(it + "\u00A0" + "\u00A0"));                    
                    $("#append").append(checkbox);                    
                    $("#append").append(label);
                });
            });           
        }

        var comp = document.getElementById('Comparator');

        var headingComp = document.createElement('h3');
        headingComp.textContent = "Select Numeric Filters";
        comp.appendChild(headingComp);



        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "smaller";
        radio.value = "smaller";
        radio.id = "smaller";

        label.appendChild(radio);

        label.appendChild(document.createTextNode("Smaller than" + "\u00A0" + "\u00A0"));


        comp.appendChild(label);
        var label1 = document.createElement("label");
        var radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "equal";
        radio1.value = "equal";
        radio1.id = "equal";

        label1.appendChild(radio1);

        label1.appendChild(document.createTextNode("Equal To" + "\u00A0" + "\u00A0"));

        comp.appendChild(label1);

        var label2 = document.createElement("label");
        var radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "greater";
        radio2.value = "greater";
        radio2.id = "greater";

        label2.appendChild(radio2);

        label2.appendChild(document.createTextNode("Greater Than" + "\u00A0" + "\u00A0"));

        comp.appendChild(label2);




        for (var col in columnList) {


            var val = [];
            val.push(this.df.distinct(columnList[col]).toArray());
            var dd = document.createElement("select");
            dd.name = "name";
            dd.id = columnList[col];
            // var i = 0;
            val.forEach(function (item, index, array) {
                dd.options[0] = new Option("All", "All");
                item.forEach(function (it, ind, arr) {
                    dd.options[ind + 1] = new Option(it, it);
                });

            })


            comp.appendChild(document.createElement("br"));
            var ColName = document.createElement('h5');
            ColName.textContent = columnList[col];
            comp.appendChild(ColName);
            comp.appendChild(dd);

        }
        //Add the dropdown t
        var stat = document.getElementById('stat');
        var headingStat = document.createElement('h3');
        headingStat.textContent = "Select Statistics column";
        stat.appendChild(headingStat);
        var statDr = document.createElement("select");
        statDr.name = "name";
        statDr.id = "statistics";
        statDr.options[0] = new Option("None", "None");

        columnList.forEach(function (item, index, array) {
            statDr.options[index + 1] = new Option(item, item);
        });
        stat.appendChild(statDr);
        //Pavithra end changes
        var button = document.createElement("button");
        button.innerHTML = "Apply filters";
        button.id = "btnApplyFilters";
        
        $(button).insertAfter($('#filterElements'));
        var data = [];
        var labelArr = [];
        button.addEventListener("click",
        function () {
            var arr = [];
            var filterCriteria = {}; //Json object containing filter criteria
            var columnLabels = [];
            var columnLabelPrior = "";
            var colLength = 0;
            $("#append").children("input:checked").map(function () {
                let columnLabel = this.className;                               
                if (!(filterCriteria.hasOwnProperty(columnLabel))) {
                    Object.defineProperty(filterCriteria, columnLabel, {
                        value: [],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });                    
                }
                filterCriteria[columnLabel].push(this.value);
                arr.push({ id: this.id, name: this.name })
            });
            
            //Call method in datatable class to filter data in existing datatable;
            parentThis._dataset.filterData(filterCriteria);                        

            var myChartCheckbox = document.getElementById('checkboxes');
            while (myChartCheckbox.firstChild) {
                myChartCheckbox.removeChild(myChartCheckbox.firstChild);
            }

            var heading = document.createElement('h3');
            heading.textContent = "Select charts";
            myChartCheckbox.appendChild(heading);

            var chartsRepo = new ChartRepository();
            var iter = chartsRepo.getIterator();
           //onsole.log(iter.hasNext());
           //onsole.log(iter.next());
            while( iter.hasNext() )
            {
                var item = iter.next();
               //onsole.log('item');
               //onsole.log(item);
                var chkbx = document.createElement('input');
                //var label = document.createElement('label');
                chkbx.type = "checkbox";
                chkbx.name = item;
                chkbx.value = item;
                chkbx.id = item;
                var lbl = document.createElement('label')
                lbl.htmlFor = item;
                lbl.appendChild(document.createTextNode(item + "\u00A0" + "\u00A0"));

                myChartCheckbox.appendChild(chkbx);
                myChartCheckbox.appendChild(lbl);
            }
            //var chartNames = ["Bar", "Pie", "Line", "Stacked", "Doughnut"];

            //chartNames.forEach(function (item, index, array) {
            //    var chkbx = document.createElement('input');
            //    //var label = document.createElement('label');
            //    chkbx.type = "checkbox";
            //    chkbx.name = item;
            //    chkbx.value = item;
            //    chkbx.id = item;
            //    var lbl = document.createElement('label')
            //    lbl.htmlFor = item;
            //    lbl.appendChild(document.createTextNode(item + "\u00A0" + "\u00A0"));

            //    myChartCheckbox.appendChild(chkbx);
            //    myChartCheckbox.appendChild(lbl);
            //});

            var btn = document.createElement("button");
            btn.innerHTML = "Select Chart Type(s)";

            myChartCheckbox.appendChild(btn);

            btn.addEventListener("click", function () {

                var chartObj = new ChartController(filterCriteria, parentThis._dataset._fileProperties, parentThis._dataset._dfObj);
                chartObj.applyCharts();
                $("#btnDrawChart").click(function () {
                    chartObj.drawChart();
                });
                
            });
        });
    }
}
