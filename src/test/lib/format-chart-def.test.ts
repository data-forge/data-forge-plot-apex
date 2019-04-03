import "jest";
import { IChartDef, AxisType, ChartType, ISingleYAxisMap, ILegendConfig } from "@data-forge-plot/chart-def";
import { formatChartDef } from "../../lib/format-chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";
import * as Sugar from "sugar";

//
//todo: 
// index is different length to values.
// handle gappy data, undefined
//

export interface ITestChartDef {
    data: ISerializedDataFrame;
    x: string;
    y: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];
    y2?: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];
    legend?: ILegendConfig;
}

describe("format chart def", () => {

    it("can set chart type", () => {

        const chartDef: any = {
            plotConfig: {
                chartType: ChartType.Bar,
            },
            data: {
                columnOrder: [],
            }
        };
        const formatted = formatChartDef(chartDef);
        expect(formatted.chart!.type).toBe("bar");

    });

    it("can plot single series with default index", () => {

        const chartDef: any = {
            plotConfig: {
                chartType: ChartType.Line,
            },
            data: {
                columnOrder: ["x"],
                columnTypes: {
                    x: "number",
                },
                index: {
                    type: "number",
                    values: [4, 5, 6],
                },
                values: [
                    {
                        x: 10,
                    },
                    {
                        x: 20,
                    },
                    {
                        x: 30,
                    },
                ],
            },
        };
        const formatted = formatChartDef(chartDef);
        expect(formatted).toEqual({
            chart: {
                type: "line",
            },
            series: [
                {
                    name: "x",
                    data: [
                        {
                            x: 4,
                            y: 10,
                        }, 
                        {
                            x: 5,
                            y: 20, 
                        },
                        {
                            x: 6,
                            y: 30,
                        },
                    ],
                },
            ],
        });
    });

    it("can plot multiple series with default index", () => {

        const chartDef: any = {
            plotConfig: {
                chartType: ChartType.Line,
            },
            data: {
                columnOrder: ["a", "b"],
                columnTypes: {
                    a: "number",
                    b: "number",
                },
                index: {
                    type: "number",
                    values: [2, 3, 4],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                    },
                    {
                        a: 20,
                        b: 200,
                    },
                    {
                        a: 30,
                        b: 300,
                    },
                ],
            },
        };
        const formatted = formatChartDef(chartDef);
        expect(formatted).toEqual({
            chart: {
                type: "line",
            },
            series: [
                {
                    name: "a",
                    data: [
                        {
                            x: 2,
                            y: 10,
                        }, 
                        {
                            x: 3,
                            y: 20, 
                        },
                        {
                            x: 4,
                            y: 30,
                        },
                    ],
                },
                {
                    name: "b",
                    data: [
                        {
                            x: 2,
                            y: 100,
                        }, 
                        {
                            x: 3,
                            y: 200, 
                        },
                        {   
                            x: 4,
                            y: 300,
                        },
                    ],
                },
            ],
        });
    });
    
    /*fio:
    it("throws when configuration is invalid", () => {
        expect (() => formatChartDef({} as IChartDef)).toThrow();
    });

    function formatSeries(series?: string | string[] | ISingleYAxisMap | ISingleYAxisMap[]): ISingleYAxisMap[] {
        if (!series) {
            return [];
        }

        if (Sugar.Object.isString(series)) {
            return [
                {
                    series,
                },
            ];
        }

        if (Sugar.Object.isObject(series)) {
            return [
                series as ISingleYAxisMap,
            ];
        }

        if (Sugar.Object.isArray(series)) {
            return (series as ISingleYAxisMap[]).map(seriesConfig => {
                if (Sugar.Object.isString(seriesConfig)) {
                    return {
                        series: seriesConfig,
                    };
                }
                else {
                    if (seriesConfig.x && Sugar.Object.isString(seriesConfig.x)) {
                        seriesConfig.x = {
                            series: seriesConfig.x,
                        };
                    }
                    return seriesConfig;
                }
            });
        }

        throw new Error("Invalid series config.");
    }

    function createMinimalChartDef(testChartDef: ITestChartDef) {
        const chartDef: IChartDef = {
            data: testChartDef.data,
            plotConfig: {
                chartType: ChartType.Line,
                width: 800,
                height: 600,
                x: {
                    axisType: AxisType.Default,
                    label: {},
                },

                y: {
                    axisType: AxisType.Default,
                    label: {},
                },

                y2: {
                    axisType: AxisType.Default,
                    label: {},
                },

                legend: {
                    show: testChartDef.legend 
                        && testChartDef.legend.show !== undefined 
                        && testChartDef.legend.show 
                        || true,
                },
            },

            axisMap: {
                x: { series: testChartDef.x },
                y: formatSeries(testChartDef.y),
                y2: formatSeries(testChartDef.y2),
            },
        };
        return chartDef;
    }

    it("minimal chart def", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["__value__"],
                columns: {
                    __value__: "number",
                },
                index: {
                    type: "number",
                    values: [5, 6],
                },
                values: [
                    {
                        __value__: 10,
                    },
                    {
                        __value__: 20,
                    },
                ],
            },
            x: "__index__",
            y: "__value__",
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    __value__: "__index__",
                },
                columns: [
                    [
                        "__value__",
                        10,
                        20,
                    ],
                    [
                        "__index__",
                        5,
                        6,
                    ],
                ],
                type: "line",
                axes: {
                    __value__: "y",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: false,
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set x and y axis expicitly", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                    },
                ],
            },
            x: "a",
            y: "b",
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                },
                columns: [
                    ["b", 100, 200],
                    ["a", 10, 20],
                ],
                type: "line",
                axes: {
                    b: "y",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: false,
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set second y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                    },
                ],
            },
            x: "a",
            y: "b",
            y2: "c",
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set multiple y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: "a",
            y: [ "b", "c" ],
            y2: [ "d", "e" ],
        });

        const c3ChartDef = formatChartDef(chartDef);

        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "a",
                    d: "a",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    d: "y2",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set x axis for y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: "__index__",
            y: [
                {
                    series: "b",
                    x: "a",
                },
                {
                    series: "c",
                    x: "d",
                },
            ],
            y2: [
                {
                    series: "e",
                    x: "a",
                },
            ],
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "d",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can configure legend", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: "__index__",
            y: [
                {
                    series: "b",
                    x: "a",
                },
                {
                    series: "c",
                    x: "d",
                },
            ],
            y2: [
                {
                    series: "e",
                    x: "a",
                },
            ],
            legend: {
                show: true,
            },
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "d",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
                y2: {
                    show: true,
                    type: "indexed",
                    label: {},
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });
    
    it("can set min and max values for Y axis", () => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: "__index__",
            y: [
                {
                    series: "b",
                    x: "a",
                },
                {
                    series: "c",
                    x: "d",
                },
            ],
            y2: [
                {
                    series: "e",
                    x: "a",
                },
            ],
            legend: {
                show: true,
            },
        });
    
        chartDef.plotConfig.y.min = 10;
        chartDef.plotConfig.y.max = 100;

        chartDef.plotConfig.y2.min = 2;
        chartDef.plotConfig.y2.max = 3;

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef.axis.y.min).toEqual(10);
        expect(c3ChartDef.axis.y.max).toEqual(100);
        expect(c3ChartDef.axis.y2.min).toEqual(2);
        expect(c3ChartDef.axis.y2.max).toEqual(3);
    });
    */
});
