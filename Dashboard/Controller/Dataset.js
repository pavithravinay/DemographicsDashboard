'use strict'

class Dataset {

    constructor() {
        this._dfObj = null;
        this._fileIn = null;
        this._fileProperties = null;
    }

    setFileProperties(fileProps) {
        this._fileProperties = fileProps;
    }

    fileProperties() {
        return this._fileProperties;
    }

    //Method to handle file uploaded event
    handleFileUploadEvent() {
        //disable file upload again until clear;
        document.getElementById("txtFileUpload").disabled = true;
        var fileIn = document.getElementById("txtFileUpload").files[0];
        this._fileIn = fileIn;
        var demographicsDf = new DemographicsDataframe(fileIn, this);
        this._dfObj = demographicsDf;
    }

    //Method to handle dataframe updated event
    handleDfChangedEvent() {
        //var demographicsDf = this._dfObj;
        var df = DemographicsDataframe.dfObject();
        var dataSetProperties = this.getFileProperties(this._fileIn, df);
        this.setFileProperties(dataSetProperties);
        this.displayDataTable(df);
    }

    //Method to get all the file properties
    getFileProperties(fileName, dfIn) {
        var fileName = this._fileIn.name;
        var dataSetObj;
        switch (fileName) {
            case "NewYork":
                dataSetObj = new NewYork(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
            case "NewYorkTest":
                dataSetObj = new NewYork(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
            case "BatonRouge":
                dataSetObj = new BatonRouge(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
            case "Houston":
                dataSetObj = new Houston(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
            case "Vegas":
                dataSetObj = new Vegas(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
            case "Washington":
                dataSetObj = new Washington(fileName, dfIn);
                return dataSetObj.getFileProperties();
                break;
        }

        var dataSetObj = new NewYork(fileName, dfIn);
        return dataSetObj.getFileProperties();
    }

    //Filter data within datatable. This method will be invoked from filter controller;
    filterData(filterCriteria) {
        var demographicsDf = this._dfObj;
        var df = DemographicsDataframe.dfObject();
        var dataFrame = demographicsDf.getDataFrame();
        //Register temp table
        df.sql.register('demographicstable', true)

        var query = "select * from demographicstable where ";
        //build where clause
        for (var col in filterCriteria) {

            var predicate = "";
            for (var i in filterCriteria[col]) {
                if (!(filterCriteria[col][i] === "All")) {
                    predicate += (JSON.stringify(filterCriteria[col][i])) + ",";
                }                    
            }
            predicate = predicate.slice(0, predicate.length - 1);
            if (predicate != "") {
                query = query + col + " IN (" + predicate + " ) AND ";
            }
        }

        query = query.slice(0, query.length - 4);
        // end build where clause
        var newDf = dataFrame.sql.request(query);
        this._dfObj.setFilteredDataframe(newDf);
        var columnList = this.getSelectedColumns();
        if (document.getElementById('smaller').checked) {
            //console.log("Test");
            for (var col in columnList) {
                var e = document.getElementById(columnList[col]);
                var strUser = e.options[e.selectedIndex].value;
                //  console.log(strUser);
                if (strUser !== "All") {
                    newDf = newDf.filter(row => row.get(columnList[col]) < strUser)
                }
            }
        }
        else if (document.getElementById('equal').checked) {
            for (var col in columnList) {
                var e = document.getElementById(columnList[col]);
                var strUser = e.options[e.selectedIndex].value;
                //  console.log(strUser);
                if (strUser !== "All") {
                    newDf = newDf.filter(row => row.get(columnList[col]) === strUser)
                }
            }
        }
        else if (document.getElementById('greater').checked) {
            for (var col in columnList) {
                var e = document.getElementById(columnList[col]);
                var strUser = e.options[e.selectedIndex].value;
                //  console.log(strUser);
                if (strUser !== "All") {
                    newDf = newDf.filter(row => row.get(columnList[col]) > strUser)   
                }
            }
        }
        else {

        }

        var e = document.getElementById("statistics");
        var strUser = e.options[e.selectedIndex].value;
        console.log(strUser);

        if (strUser !== "None") {
            var stats = newDf.stat.stats(strUser);
            var div = document.getElementById('stat');

            for (var it in stats) {
                div.appendChild(document.createElement("br"));
                div.appendChild(document.createTextNode(it + " : " + stats[it] + "\u00A0"));
            }
        }
        this.displayDataTable(newDf, columnList);
    }

    //This method orchestrates display of datatable
    displayDataTable(dfIn, columnList) {
        this.clearDataTableContent(); //Clear existing table, if any;
        var dataSet, df, columnFilter = "";
        if (columnList != undefined) {
            df = dfIn.select(...columnList)
            dataSet = df.toArray();
        }
        else {
            df = dfIn;
            dataSet = df.toArray();
        }
        this.displayColumns(df);
        var columnNames = this.toObject(df.listColumns());
        $('#dataset').DataTable({
            data: dataSet,
            columns: columnNames,
            "ordering": false,
            "info": false,
            "searching": false,
            "pageLength": 10
        });
    }

    //Method to apply column selection
    applySelection() {
        try {
            $("#selectFilterlbl").remove();
            $("#btnApplyFilters").remove();
            var columnList = this.getSelectedColumns();
            var df = DemographicsDataframe.dfObject();
            this.displayDataTable(df, columnList);
            var filterObj = new filterController(df, columnList, this);
            filterObj.displayUniqueRowValueFilters();
        }
        catch (error) {
            console.log(error.message)
        }
    }

    //This method displays list of columns to apply selection criteria
    displayColumns(df) {
        var columns = $("#selection .selectionColumn label input[name=lblColSelect]:checked");
        if (!(columns.length > 0)) {
            var columnNames = this.toObject(df.listColumns());
            for (var col in columnNames) {
                var label1 = "<label><input type='checkbox'  name='lblColSelect' value='" + columnNames[col].title + "'/> ";
                var label2 = "</label>";
                var content = label1.concat(columnNames[col].title, label2);
                $("<div></div>")
                     .addClass("col-md-3 checkbox selectionColumn")
                     .attr("name", "selectionColumn")
                     .appendTo("#selection")
                     .append(content)
            }
            $("#selection").show();
            $("#applySelection").show();
        }

    }

    //Method to clear datatable content
    clearContent() {
        try {
            if ($.fn.DataTable.isDataTable('#dataset')) {
                var table = $('#dataset').DataTable();
                table.destroy();
                document.getElementById("txtFileUpload").disabled = false;
            }
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            $('#dataset').empty();
            $("#txtFileUpload").empty();
            $("txtFileUpload").value = "";
            $('#selection').empty();
            $('#applySelection').empty();
            $('#btnApplyFilters').empty();
            $('#filterElements').empty();          
            $('#checkboxes').empty();
            $('#ChartCriteria').empty();
            $('#charts').empty();
        }
    }

    clearDataTableContent() {
        try {
            if ($.fn.DataTable.isDataTable('#dataset')) {
                var table = $('#dataset').DataTable();
                table.destroy();
            }
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            $('#dataset').empty();
            $("#txtFileUpload").empty();
            $("txtFileUpload").value = "";
            //$('#filterElements').contents().remove();
        }
    }


    //This method takes an array as input and returns an objectArray with "title" as the key for each object
    toObject(arr) {
        var objArray = [];
        for (var i = 0; i < arr.length; i++) {
            objArray[i] = { "title": arr[i] };
        }
        return objArray;
    }



    getSelectedColumns() {
        var columns = $("#selection .selectionColumn label input[name=lblColSelect]:checked");
        var checkedColumns = [];
        for (var col in columns) {
            if (columns[col].type == "checkbox") {
                checkedColumns.push(columns[col].value);
            }
        }
        return checkedColumns;
    }

    //Method to convert string to function;
    stringToFunction(str) {
        var arr = str.split(".");

        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return fn;
    };

}