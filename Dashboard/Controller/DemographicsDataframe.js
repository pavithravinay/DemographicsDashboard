'use strict'

/**
* DemographicsDataframe class acts as wrapper to DataFrame library.
**/
class DemographicsDataframe {

    constructor(fileIn, client) {
        this._file = fileIn;
        this.DataFrame = dfjs.DataFrame;
        this.DataFrame.fromCSV(fileIn).then(df =>this.setdfObject(df));
        this._client = client;
        this._filteredDataframe = null;
    }

    setdfObject(dfIn) {
        DemographicsDataframe._df = dfIn;
        this._dfColumns = DemographicsDataframe._df.listColumns();
        this.notifyClients();
    }

    setFilteredDataframe(filteredDf) {
        this._filteredDataframe = filteredDf;
    }

    getFilteredDataframe() {
        return this._filteredDataframe;
    }

    //Child classes can call this getter to access to df object
    static dfObject() {
        return DemographicsDataframe._df;
    }

    //Getter for instance of DataFrame
    getDataFrame() {
        return this.DataFrame;
    }

    dfColulmns() {
        return this._dfColumns;
    }

    notifyClients() {
        this._client.handleDfChangedEvent();
    }
}