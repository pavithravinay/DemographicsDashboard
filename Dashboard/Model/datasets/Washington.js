'use strict'

class Washington {

    constructor(fileName, dfIn) {
        var fileProps = {};
        var columns = dfIn.listColumns();

        for (let col in columns) {
            Object.defineProperty(fileProps, columns[col], {
                value: {},
                writable: true,
                enumerable: true,
                configurable: true
            });
            var distinctCount = dfIn.distinct(columns[col]).count();
            if (distinctCount > 50) {
                fileProps[columns[col]].dimension = "y";
                fileProps[columns[col]].groupBy = "sum";
            }
            else {
                fileProps[columns[col]].dimension = "xy";
                fileProps[columns[col]].groupBy = "count";
            }
        }

        this._properties = fileProps;
    }

    getFileProperties() {
        return this._properties;
    }
}