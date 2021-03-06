import tape from 'tape';

import path from 'path';
import { DataFrame } from '../src/index.js';
import { tryCatch } from './utils.js';

const test = tape;

test('DataFrame can be', (assert) => {
    const dict = {
        column1: [3, 6, 8],
        column2: [3, 4, 5, 6],
    };

    const table = [
        [1, 6, 9, 10, 12],
        [1, 2],
        [6, 6, 9, 8, 9, 12],
    ];

    const collection = [{
        c1: 1,
        c2: 6,
        c3: 9,
        c4: 10,
        c5: 12,
    }, {
        c4: 1,
        c3: 2,
    }, {
        c1: 6,
        c5: 6,
        c2: 9,
        c4: 8,
        c3: 9,
        c6: 12,
    }];

    assert.equal(
        new DataFrame(dict, ['column1', 'column2']).constructor.name,
        'DataFrame',
        'created from an Object of Arrays.'
    );

    assert.equal(
        new DataFrame(dict).constructor.name,
        'DataFrame',
        'created from an Object of Arrays by infering columns.'
    );

    assert.deepEqual(
        new DataFrame(table, ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']).constructor.name,
        'DataFrame',
        'created from an Array of Arrays.'
    );

    assert.deepEqual(
        new DataFrame(table).constructor.name,
        'DataFrame',
        'created from Array of Arrays by infering columns.'
    );

    assert.deepEqual(
        new DataFrame(collection, ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']).constructor.name,
        'DataFrame',
        'created from Array of Objects.'
    );

    assert.deepEqual(
        new DataFrame(collection).constructor.name,
        'DataFrame',
        'created from an Array of Objects by infering columns.'
    );

    assert.deepEqual(
        new DataFrame(new DataFrame(collection)).constructor.name,
        'DataFrame',
        'created from another DataFrame.'
    );

    const currentPath = path.resolve(__dirname) + '/data';

    DataFrame.fromCSV(`${currentPath}/Titanic.csv`, true).then(
        (value) => (
            assert.deepEqual(
                value.toCollection()[0],
                {'': '1', Age: 'Child', Class: '1st', Freq: '0', Sex: 'Male', Survived: 'No' },
                'created from a csv file wtih header.'
            )
        )
    );

    DataFrame.fromCSV(`${currentPath}/Titanic_2.csv`, false).then(
        (value) => (
            assert.deepEqual(
                value.toCollection()[0],
                {'0': '1', '1': '1st', '2': 'Male', '3': 'Child', '4': 'No', '5': '0' },
                'created from a csv file without header.'
            )
        )
    );

    DataFrame.fromText(`${currentPath}/Titanic_2.csv`, '', false).then(
        (value) => (
            assert.deepEqual(
                value.toCollection()[0],
                {'0': '1', '1': '1st', '2': 'Male', '3': 'Child', '4': 'No', '5': '0' },
                'created from a text file with a custom seprator.'
            )
        )
    );

    DataFrame.fromJSON(`file:///${currentPath}/Titanic.json`).then(
        (value) => (
            assert.deepEqual(
                value.toCollection()[0],
                {'': 1, Age: 'Child', Class: '1st', Freq: 0, Sex: 'Male', Survived: 'No' },
                'created from a JSON containing a column by key.'
            )
        )
    );

    DataFrame.fromJSON(`file:///${currentPath}/Titanic_2.json`).then(
        (value) => (
            assert.deepEqual(
                value.toCollection()[0],
                {'FIELD1': 1, Age: 'Child', Class: '1st', Freq: 0, Sex: 'Male', Survived: 'No' },
                'created from a JSON containing a collection of rows.'
            )
        )
    );

    const df1 = new DataFrame([
        [1, 6, 9, 10, 12],
        [1, 2],
        [6, 6, 9, 8, 9, 12],
    ], ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);

    assert.deepEqual(df1.dim(), [3, 6], 'measured, getting dimensions.');

    assert.deepEqual(
        df1.toCollection(true).map(row => row.toDict()), [
            {c1: 1, c2: 6, c3: 9, c4: 10, c5: 12, c6: undefined},
            {c1: 1, c2: 2, c3: undefined, c4: undefined, c5: undefined, c6: undefined},
            {c1: 6, c2: 6, c3: 9, c4: 8, c5: 9, c6: 12},
        ], 'converted into a collection of rows.'
    );

    assert.deepEqual(
        [...df1].map(row => row.toDict()), [
            {c1: 1, c2: 6, c3: 9, c4: 10, c5: 12, c6: undefined},
            {c1: 1, c2: 2, c3: undefined, c4: undefined, c5: undefined, c6: undefined},
            {c1: 6, c2: 6, c3: 9, c4: 8, c5: 9, c6: 12},
        ], 'converted into a collection of rows by destructuring.'
    );

    assert.deepEqual(
        df1.toCollection(), [
            {c1: 1, c2: 6, c3: 9, c4: 10, c5: 12, c6: undefined},
            {c1: 1, c2: 2, c3: undefined, c4: undefined, c5: undefined, c6: undefined},
            {c1: 6, c2: 6, c3: 9, c4: 8, c5: 9, c6: 12},
        ], 'converted into a collection of dictionnaries.'
    );

    assert.deepEqual(
        df1.toDict(), {
            c1: [1, 1, 6],
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
            c4: [10, undefined, 8],
            c5: [12, undefined, 9],
            c6: [undefined, undefined, 12],
        }, 'converted into a dictionnary.'
    );

    assert.deepEqual(
        df1.toArray(), [
            [1, 6, 9, 10, 12, undefined],
            [1, 2, undefined, undefined, undefined, undefined],
            [6, 6, 9, 8, 9, 12],
        ], 'converted into an Array.'
    );

    assert.equal(
        df1.toText(),
        'c1;c2;c3;c4;c5;c6\n1;6;9;10;12;\n1;2;;;;\n6;6;9;8;9;12',
        'converted into a text with header.'
    );

    assert.equal(
        df1.toText(';', false),
        '1;6;9;10;12;\n1;2;;;;\n6;6;9;8;9;12',
        'converted into a text without header.'
    );

    assert.equal(
        df1.toCSV(false),
        '1,6,9,10,12,\n1,2,,,,\n6,6,9,8,9,12',
        'converted into a csv without header.'
    );

    assert.equal(
        df1.toCSV(),
        'c1,c2,c3,c4,c5,c6\n1,6,9,10,12,\n1,2,,,,\n6,6,9,8,9,12',
        'converted into a csv with header.'
    );

    assert.equal(
        df1.toJSON(),
        '{"c1":[1,1,6],"c2":[6,2,6],"c3":[9,null,9],"c4":[10,null,8],"c5":[12,null,9],"c6":[null,null,12]}',
        'converted into a json.'
    );

    assert.equal(
        df1.toJSON(true),
        '[{"c1":1,"c2":6,"c3":9,"c4":10,"c5":12},{"c1":1,"c2":2},{"c1":6,"c2":6,"c3":9,"c4":8,"c5":9,"c6":12}]',
        'converted into a json as a collection of Object.'
    );

    const df2 = new DataFrame({
        column1: [3, 6, 8],
        column2: ['3', '4', '5', '6'],
        column3: [],
    }, ['column1', 'column2', 'column3']);

    const expectedShow = [
        '| column1   | column2   | column3   |',
        '------------------------------------',
        '| 3         | 3         | undefined |',
        '| 6         | 4         | undefined |',
        '| 8         | 5         | undefined |',
        '| undefined | 6         | undefined |',
    ].join('\n');

    assert.equal(df2.show(10, true), expectedShow, 'showed as a String table.');

    assert.deepEqual(
        df2.transpose().toDict(), {
            '0': [3, '3', undefined],
            '1': [6, '4', undefined],
            '2': [8, '5', undefined],
            '3': [undefined, '6', undefined],
        }, 'transposed.'
    );

    assert.deepEqual(
        df2.transpose(true).toDict(), {
            'rowNames': ['column1', 'column2', 'column3'],
            '0': [3, '3', undefined],
            '1': [6, '4', undefined],
            '2': [8, '5', undefined],
            '3': [undefined, '6', undefined],
        }, 'transposed, keeping columnNames as rowNames.'
    );

    assert.end();
});

test('DataFrame can\'t be', (assert) => {
    assert.equal(tryCatch(() => new DataFrame('')).name, 'TypeError', 'created from a String, throwing TypeError.');

    assert.equal(tryCatch(() => new DataFrame()).name, 'TypeError', 'created from a nothing, throwing TypeError.');

    assert.equal(tryCatch(() => new DataFrame(445)).name, 'TypeError', 'created from a Number, throwing TypeError.');

    assert.end();
});

test('DataFrame columns can be', (assert) => {
    const df = new DataFrame([
        [1, 6, 9, 10, 12],
        [1, 2],
        [6, 6, 9, 8, 9, 12],
    ], ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);

    assert.deepEqual(df.listColumns(), ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'], 'listed.');

    assert.equal(df.listColumns().length, 6, 'counted.');

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').toDict(), {
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
            c4: [10, undefined, 8],
        }, 'selected.'
    );

    assert.deepEqual(
        df.select('c2').toArray(), [
            [6],
            [2],
            [6],
        ], 'selected individually.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').withColumn('c5', (row) => row.get('c2') - 2).toDict(), {
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
            c4: [10, undefined, 8],
            c5: [4, 0, 4],
        }, 'created.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').withColumn('c4', (row) => row.get('c2') ? row.get('c2') - 2 : 0 - 2).toDict(), {
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
            c4: [4, 0, 4],
        }, 'modified.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').drop('c4').toDict(), {
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
        }, 'deleted.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').renameAll(['c16', 'c17', 'c18']).listColumns(),
            ['c16', 'c17', 'c18'],
            'renamed.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').renameAll(['c16', 'c17', 'c18']).toArray()[0],
            [6, 9, 10],
            'renamed without altering data.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').rename('c2', 'cRenamed').listColumns(),
        ['cRenamed', 'c3', 'c4'],
        'renamed individually.'
    );

    class CustomClass {
        constructor(valueToConvert) {
            this.value = String(Number(valueToConvert) * 10);
        }
    }

    assert.deepEqual(
        df.select('c1', 'c2', 'c3').castAll([String, Number, (val) => new CustomClass(val)]).toArray()[0],
            ['1', 6, {value: '90'}],
            'cast.'
    );

    assert.deepEqual(
        df.select('c1', 'c2', 'c3').cast('c2', String).toArray()[0],
        [1, '6', 9],
        'cast individually.'
    );

    assert.deepEqual(
        df.restructure(['c2', 'c3', 'c36']).toDict(), {
            c2: [6, 2, 6],
            c3: [9, undefined, 9],
            c36: [undefined, undefined, undefined],
        },
        'restructured.'
    );

    assert.deepEqual(
        df.restructure(['c2', 'c3', 'c1']).toCollection(), [
            { c2: 6, c3: 9, c1: 1 },
            { c2: 2, c3: undefined, c1: 1 },
            { c2: 6, c3: 9, c1: 6 },
        ], 'restructured to reorder existing columns.'
    );

    assert.deepEqual(
        df.distinct('c1').toArray('c1'), [1, 6], 'distinct, giving a column of unique values.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').replace(undefined, 0).toDict(), {
            c2: [6, 2, 6],
            c3: [9, 0, 9],
            c4: [10, 0, 8],
        }, 'modified, replacing a value by another.'
    );

    assert.deepEqual(
        df.select('c2', 'c3', 'c4').replace(undefined, 0, ['c2', 'c3']).toDict(), {
            c2: [6, 2, 6],
            c3: [9, 0, 9],
            c4: [10, undefined, 8],
        }, 'modified, replacing a value by another in some columns.'
    );

    assert.deepEqual(df.toArray('c2'), [6, 2, 6], 'converted into Array.');

    assert.end();
});

test('DataFrame columns can\'t be ', (assert) => {
    assert.equal(
        tryCatch(() => new DataFrame([{c1: 1, c2: 3}]).renameAll(['c1'])).name,
        'WrongSchemaError',
        'renamed when providing different columns number, throwing WrongSchemaError.'
    );

    assert.end();
});

test('DataFrame rows can be ', (assert) => {
    const df1 = new DataFrame({
        column1: [3, 6, 8],
        column2: ['3', '4', '5', '6'],
        column3: [],
    }, ['column1', 'column2', 'column3']);

    assert.equal(df1.count(), 4, 'counted.');

    assert.equal(df1.countValue('4', 'column2'), 1, 'counted based on a specific value in a column.');

    assert.equal(df1.countValue(9, 'column1'), 0, 'counted based on a specific value in a selected column.');

    assert.deepEqual(
        df1.push([1, 9, 6], [0, 5, 6]).toArray(), [
            [3, '3', undefined],
            [6, '4', undefined],
            [8, '5', undefined],
            [undefined, '6', undefined],
            [1, 9, 6],
            [0, 5, 6],
        ], 'completed by pushing Arrays.'
    );

    assert.deepEqual(
        df1.push({column1: 1, column2: 9, column3: 6}, {column1: 0, column2: undefined, column3: 9}).toArray(), [
            [3, '3', undefined],
            [6, '4', undefined],
            [8, '5', undefined],
            [undefined, '6', undefined],
            [1, 9, 6],
            [0, undefined, 9],
        ], 'completed by pushing dictionnaries.'
    );

    assert.deepEqual(
        df1.push(...[...df1]).toArray(), [
            [3, '3', undefined],
            [6, '4', undefined],
            [8, '5', undefined],
            [undefined, '6', undefined],
            [3, '3', undefined],
            [6, '4', undefined],
            [8, '5', undefined],
            [undefined, '6', undefined],
        ], 'completed by pushing rows.'
    );

    assert.deepEqual(
        df1.filter((line) => line.get('column1') > 3).toArray(), [
            [6, '4', undefined],
            [8, '5', undefined],
        ], 'filtered.'
    );

    assert.deepEqual(
        df1.filter({column1: 6}).toArray(), [
            [6, '4', undefined],
        ], 'filtered by passing a column/value Object.'
    );

    assert.deepEqual(df1.find({column1: 6}).toArray(), [6, '4', undefined], 'found a row and returned it.');

    assert.deepEqual(df1.find({column1: 12}), undefined, 'found nothing and returned undefined.');

    assert.deepEqual(
        df1.map((line) => line.set('column1', 3)).toArray(), [
            [3, '3', undefined],
            [3, '4', undefined],
            [3, '5', undefined],
            [3, '6', undefined],
        ], 'modified.'
    );

    assert.deepEqual(
        df1.filter((line) => line.get('column1') > 3).map((line) => line.set('column1', 3)).toArray(), [
            [3, '4', undefined],
            [3, '5', undefined],
        ], 'filtered and modified.'
    );

    assert.deepEqual(
        df1.chain((line) => line.get('column1') > 3, (line) => line.set('column1', 3)).toArray(), [
            [3, '4', undefined],
            [3, '5', undefined],
        ], 'filtered and modified by chains (giving the same result, but faster).'
    );

    assert.deepEqual(
        df1.chain(
            (line) => line.get('column1') > 3,
            (line) => line.set('column1', 3),
            (line) => line.get('column2') === '5').toArray(),
        [[3, '5', undefined]],
        'filtered and modified and filtered (again) by chains.'
    );

    const df2 = df1.withColumn('column1', (row) => row.get('column1') ? row.get('column1') : 0);

    assert.equal(df2.reduce((p, n) => n.get('column1') + p, 0), 17, 'reduced to obtain a value.');

    assert.deepEqual(
        df2.reduce((p, n) => (
            n.set('column1', p.get('column1') + n.get('column1'))
            .set('column2', p.get('column2') + n.get('column2'))
        )).toArray(), [17, '3456', undefined], 'reduced to obtain a row.'
    );

    assert.deepEqual(
        df2.reduceRight((p, n) => (
            n.set('column1', p.get('column1') + n.get('column1'))
            .set('column2', p.get('column2') + n.get('column2'))
        )).toArray(), [17, '6543', undefined], 'reduced by right to obtain a row.'
    );

    const df3 = new DataFrame({
        id: [3, 6, 8, 1, 1, 3, 8],
        value: [1, 0, 1, 1, 1, 2, 4],
    }, ['id', 'value']);

    const df4 = new DataFrame({
        id: [3, 6, 8, 1, 1, 3, 8, 3],
        id2: ['a', 'a', 'b', 'c', 'b', 'b', 'b', 'a'],
        value: [1, 0, 1, 1, 1, 2, 4, 6],
    }, ['id', 'id2', 'value']);

    assert.deepEqual(
        df3.groupBy('id').toCollection().map(({groupKey, group}) => ({groupKey, group: group.toDict()})), [
            { groupKey: {id: 3}, group: {id: [3, 3], value: [1, 2]}},
            { groupKey: {id: 6}, group: {id: [6], value: [0]}},
            { groupKey: {id: 8}, group: {id: [8, 8], value: [1, 4]}},
            { groupKey: {id: 1}, group: {id: [1, 1], value: [1, 1]}},
        ], 'groupBy on a column.'
    );

    assert.deepEqual(
        df3.groupBy('id').aggregate(group => group.count()).toDict(), {
            id: [3, 6, 8, 1],
            aggregation: [2, 1, 2, 2],
        }, 'groupBy and compute (by aggregation) the count by group.'
    );

    assert.deepEqual(
        df4.groupBy('id', 'id2').aggregate(group => group.count()).toDict(), {
            id: [3, 3, 6, 8, 1, 1],
            id2: ['a', 'b', 'a', 'b', 'b', 'c'],
            aggregation: [2, 1, 1, 2, 1, 1],
        }, 'groupBy on multiple columns and compute the count by group.'
    );

    assert.deepEqual(
        df3.sortBy('id').toArray(), [
            [1, 1],
            [1, 1],
            [3, 1],
            [3, 2],
            [6, 0],
            [8, 1],
            [8, 4],
        ], 'sorted by a column.'
    );

    assert.deepEqual(
        df3.sortBy('id', true).toArray(), [
            [8, 1],
            [8, 4],
            [6, 0],
            [3, 1],
            [3, 2],
            [1, 1],
            [1, 1],
        ], 'sorted and reverse by a column.'
    );

    const df5 = new DataFrame({
        id: [3, 1, 8],
        value: [1, 0, 1],
    }, ['id', 'value']);

    assert.deepEqual(
        df3.union(df5).toArray(), [
            [8, 1],
            [8, 4],
            [6, 0],
            [3, 1],
            [3, 2],
            [1, 1],
            [1, 1],
            [3, 1],
            [1, 0],
            [8, 1],
        ], 'concatenated with another DataFrame.'
    );

    const df5b = new DataFrame({
        id: [3, 1, 8],
        value: [1, 0, 1],
    }, ['value', 'id']);

    assert.deepEqual(
        df3.union(df5b).toArray(), [
            [8, 1],
            [8, 4],
            [6, 0],
            [3, 1],
            [3, 2],
            [1, 1],
            [1, 1],
            [1, 3],
            [0, 1],
            [1, 8],
        ], 'concatenated with another DataFrame, with columns not in the same order.'
    );

    const df6 = new DataFrame({
        id: [3, 3, 1, 8],
        id2: ['a', 'b', 'a', 'c'],
        value: [1, 2, 0, 1],
    }, ['id', 'id2', 'value']);


    const df6b = new DataFrame({
        id: [2, 1, 6, 8, 3, 3],
        id2: ['a', 'a', 'c', 'c', 'b', 'b'],
        value2: [1, 0, 1, 2, 6, 5],
    }, ['id', 'id2', 'value2']);


    assert.deepEqual(
        df6.innerJoin(df6b, 'id').sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 3, id2: 'a', value: 1, value2: 6 },
            { id: 3, id2: 'a', value: 1, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
        ], 'inner joined.'
    );

    assert.deepEqual(
        df6.innerJoin(df6b, ['id', 'id2']).sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
        ], 'inner joined on multiple columns.'
    );

    assert.deepEqual(
        df6.fullJoin(df6b, 'id').sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 2, id2: 'a', value: undefined, value2: 1 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 3, id2: 'a', value: 1, value2: 6 },
            { id: 3, id2: 'b', value: 1, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'a', value: 1, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 1, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 6, id2: 'c', value: undefined, value2: 1 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
        ], 'full joined.'
    );

    assert.deepEqual(
        df6.fullJoin(df6b, ['id', 'id2']).sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 2, id2: 'a', value: undefined, value2: 1 },
            { id: 3, id2: 'a', value: 1, value2: undefined },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 6, id2: 'c', value: undefined, value2: 1 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
        ], 'full joined on multiple columns.'
    );

    assert.deepEqual(
        df6.outerJoin(df6b, 'id').sortBy('id').toCollection(), [
            { id: 2, id2: 'a', value: undefined, value2: 1 },
            { id: 6, id2: 'c', value: undefined, value2: 1 },
        ], 'outer joined.'
    );

    assert.deepEqual(
        df6.outerJoin(df6b, ['id', 'id2']).sortBy('id').toCollection(), [
            { id: 2, id2: 'a', value: undefined, value2: 1 },
            { id: 3, id2: 'a', value: 1, value2: undefined },
            { id: 6, id2: 'c', value: undefined, value2: 1 },
        ], 'outer joined on multiple columns.'
    );

    assert.deepEqual(
        df6b.leftJoin(df6, 'id').sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 2, id2: 'a', value2: 1, value: undefined },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 3, id2: 'b', value2: 6, value: 1 },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 1 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 3, id2: 'a', value2: 6, value: 1 },
            { id: 3, id2: 'a', value2: 5, value: 1 },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 6, id2: 'c', value2: 1, value: undefined },
            { id: 8, id2: 'c', value2: 2, value: 1 },
            { id: 8, id2: 'c', value2: 2, value: 1 },
        ], 'left joined.'
    );

    assert.deepEqual(
        df6b.leftJoin(df6, ['id', 'id2']).sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 2, id2: 'a', value2: 1, value: undefined },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 6, id2: 'c', value2: 1, value: undefined },
            { id: 8, id2: 'c', value2: 2, value: 1 },
            { id: 8, id2: 'c', value2: 2, value: 1 },
        ], 'left joined on multiple columns.'
    );

    assert.deepEqual(
        df6.rightJoin(df6b, 'id').sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 1, id2: 'a', value: 0, value2: 0 },
            { id: 2, id2: 'a', value: undefined, value2: 1 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 3, id2: 'a', value: 1, value2: 6 },
            { id: 3, id2: 'b', value: 1, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'a', value: 1, value2: 5 },
            { id: 3, id2: 'b', value: 2, value2: 6 },
            { id: 3, id2: 'b', value: 1, value2: 6 },
            { id: 3, id2: 'b', value: 2, value2: 5 },
            { id: 6, id2: 'c', value: undefined, value2: 1 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
            { id: 8, id2: 'c', value: 1, value2: 2 },
        ], 'right joined.'
    );

    assert.deepEqual(
        df6.rightJoin(df6b, ['id', 'id2']).sortBy('id').toCollection(), [
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 2, id2: 'a', value2: 1, value: undefined },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 6, id2: 'c', value2: 1, value: undefined },
            { id: 8, id2: 'c', value2: 2, value: 1 },
            { id: 8, id2: 'c', value2: 2, value: 1 },
        ], 'right joined on multiple columns.'
    );

    assert.deepEqual(
        df6.rightJoin(df6b, ['id', 'id2']).sortBy('id').dropDuplicates().toCollection(), [
            { id: 1, id2: 'a', value2: 0, value: 0 },
            { id: 2, id2: 'a', value2: 1, value: undefined },
            { id: 3, id2: 'b', value2: 6, value: 2 },
            { id: 3, id2: 'b', value2: 5, value: 2 },
            { id: 6, id2: 'c', value2: 1, value: undefined },
            { id: 8, id2: 'c', value2: 2, value: 1 },
        ], 'deduplicated.'
    );

    const df7 = new DataFrame([...Array(20).keys()].map(row => [row]), ['c1']);

    assert.isNotDeepEqual(
        df7.shuffle().toArray(),
        df7.toArray(),
        'randomly shuffled.'
    );

    assert.equal(
        df7.shuffle().count(),
        df7.count(),
        'randomly shuffled and get the same length.'
    );

    const df8 = new DataFrame([...Array(5000).keys()].map(row => [row]), ['c1']);

    assert.equal(
        df8.sample(0.2).count(),
        1000,
        'randomly sampled.'
    );

    assert.deepEqual(
        df8.bisect(0.2).map(splittedDF => splittedDF.count()),
        [1000, 4000],
        'bisected by percentage into 2 DataFrames.'
    );

    const pivotedDf6 = df6.groupBy('id').pivot('id2', gdf => gdf.stat.sum('value'));

    assert.deepEqual(
        pivotedDf6.toCollection(),
        [
            { id: 3, a: 1, b: 2, c: undefined },
            { id: 1, a: 0, b: undefined, c: undefined },
            { id: 8, a: undefined, b: undefined, c: 1 },
        ],
        'pivoted.'
    );

    assert.deepEqual(
        pivotedDf6.groupBy('id').melt().toCollection(),
        [
            { id: 3, variable: 'a', value: 1 },
            { id: 3, variable: 'b', value: 2 },
            { id: 3, variable: 'c', value: undefined },
            { id: 1, variable: 'a', value: 0 },
            { id: 1, variable: 'b', value: undefined },
            { id: 1, variable: 'c', value: undefined },
            { id: 8, variable: 'a', value: undefined },
            { id: 8, variable: 'b', value: undefined },
            { id: 8, variable: 'c', value: 1 },
        ],
        'melted.'
    );

    assert.end();
});

test('DataFrame rows can\'t be ', (assert) => {
    assert.equal(
        tryCatch(() => new DataFrame([{c1: 1, c2: 3}]).union(new DataFrame([{c1: 1, c4: 3}]))).name,
        'WrongSchemaError',
        'concatenated when providing different columns, throwing WrongSchemaError.'
    );

    assert.equal(
        tryCatch(() => new DataFrame([{c1: 1, c2: 3}]).union([])).name,
        'TypeError',
        'concatened with not a DataFrame, throwing TypeError.'
    );

    assert.equal(
        tryCatch(() => new DataFrame([{c1: 1, c2: 3}]).innerJoin([])).name,
        'TypeError',
        'joined with not a DataFrame, throwing TypeError.'
    );

    assert.equal(
        tryCatch(() => new DataFrame([{c1: 1, c2: 3}, {c1: undefined, c2: '4'}]).sortBy('c1')).name,
        'MixedTypeError',
        'sortBy on a mixed types column, throwing MixedTypeError.'
    );

    assert.end();
});

test('DataFrame modules can be ', (assert) => {
    class FakeModule {
        constructor(dataframe) {
            this.df = dataframe;
            this.name = 'fakemodule';
        }

        test(x) {
            return x * 2;
        }
    }

    const df = new DataFrame({
        column1: [3, 6, 8],
        column2: ['3', '4', '5', '6', 'yolo'],
        column3: [],
    }, ['column1', 'column2', 'column3'], FakeModule);

    assert.equal(
        df.fakemodule.test(4),
        8,
        'registered in an DataFrame instance and used.'
    );

    assert.equal(
        df.modules.length,
        4,
        'listed from an instance and counted.'
    );

    assert.equal(
        DataFrame.defaultModules.length,
        3,
        'listed from the default DataFrame static properties and counted.'
    );

    DataFrame.setDefaultModules(...DataFrame.defaultModules, FakeModule);

    assert.equal(
        new DataFrame({
            column1: [3, 6, 8],
            column2: ['3', '4', '5', '6', 'yolo'],
            column3: [],
        }, ['column1', 'column2', 'column3']).fakemodule.test(6),
        12,
        'registered as default DataFrame static properties and used.'
    );

    assert.end();
});

test('DataFrame stay immutable when', (assert) => {
    const df = new DataFrame([
        [1, 6, 9, 10, 12],
        [1, 2],
        [6, 6, 9, 8, 9, 12],
    ], ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);


    assert.equal(
        Object.is(df.map(row => row.set('c1', 18)), df),
        false, 'modified.'
    );

    assert.equal(
        Object.is(df.map(row => row), df),
        false, 'modified, even if nothing have changed.'
    );

    assert.end();
});
