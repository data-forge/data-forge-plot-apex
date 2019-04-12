import "jest";
import { IChartDef, AxisType, ChartType, ISingleYAxisMap, ILegendConfig } from "@data-forge-plot/chart-def";
import { formatChartDef } from "../../lib/format-chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";
import * as Sugar from "sugar";

export interface ITestChartDef {
    data: ISerializedDataFrame;
    x: string;
    y: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];
    y2?: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];
    legend?: ILegendConfig;
}

describe("format chart def", () => {

    const defaultChartWidth = "100%";
    const defaultChartHeight = "100%";

    function makeChartDef(inputChartDef?: any): IChartDef {
        const chartDef: any = {
            plotConfig: {
                chartType: inputChartDef && inputChartDef.chartType || "line",
                width: inputChartDef && inputChartDef.width,
                height: inputChartDef && inputChartDef.height,
            },
            data: inputChartDef && inputChartDef.data || {
                columnOrder: [],
            },
            axisMap: {
                x: inputChartDef && inputChartDef.axisMap && inputChartDef.axisMap.x,
                y: inputChartDef && inputChartDef.axisMap && inputChartDef.axisMap.y || [],
                y2: inputChartDef && inputChartDef.axisMap && inputChartDef.axisMap.y2 || [],
            },
        };
        return chartDef;
    }

    it("throws when configuration is invalid", () => {
        const badChartDef: any = {};
        expect (() => formatChartDef(badChartDef)).toThrow();
    });

    it("can set chart type", () => {

        const apexChartDef = formatChartDef(makeChartDef({ chartType: ChartType.Bar }));
        expect(apexChartDef.chart!.type).toBe("bar");
    });

    it("animations are disabled", () => {

        const apexChartDef = formatChartDef(makeChartDef());
        expect(apexChartDef.chart!.animations!.enabled).toBe(false);
    });

    it("width and height are defaulted if not supplied", () => {

        const apexChartDef = formatChartDef(makeChartDef());
        expect(apexChartDef.chart!.width).toBe(defaultChartWidth);
        expect(apexChartDef.chart!.height).toBe(defaultChartHeight);
    });

    it("width and height are passed through if supplied", () => {
        
        const width = 22;
        const height = 53;
        const apexChartDef = formatChartDef(makeChartDef({ width, height }));
        expect(apexChartDef.chart!.width).toBe(width);
        expect(apexChartDef.chart!.height).toBe(height);
    });
    
    it("can plot single series with default index", () => {

        const chartDef = {
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
            axisMap: {
                y: [
                    {
                        series: "x",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
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
            yaxis: [
                {
                    opposite: false,
                },
            ],
        });
    });

    it("can plot multiple series with default index", () => {

        const chartDef = {
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
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
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
            yaxis: [
                {
                    opposite: false,
                },
                {
                    opposite: false,
                },
            ],
        });
    });
    
    it("can pluck named series for y axis", () => {

        const chartDef = {
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
            axisMap: {
                y: [
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
            },
            series: [
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
            yaxis: [
                {
                    opposite: false,
                },
            ],
        });
    });

    it("can pluck named series for x axis", ()  => {

        const chartDef = {
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
            axisMap: {
                x: {
                    series: "a",
                },
                y: [
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
            },
            series: [
                    {
                    name: "b",
                    data: [
                        {
                            x: 10,
                            y: 100,
                        }, 
                        {
                            x: 20,
                            y: 200, 
                        },
                        {   
                            x: 30,
                            y: 300,
                        },
                    ],
                },
            ],
            yaxis: [
                {
                    opposite: false,
                },
            ],
        });
    });

    it("can pluck named series for second y axis", ()  => {

        const chartDef = {
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
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                ],
                y2: [
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
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
            yaxis: [
                {
                    opposite: false,
                },
                {
                    opposite: true,
                },
            ],
        });
    });

    it("can pluck multiple named series for second y axis", ()  => {

        const chartDef = {
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
            axisMap: {
                y2: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
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
            yaxis: [
                {
                    opposite: true,
                },
                {
                    opposite: true,
                },
            ],
        });
    });

    it("can set x axis per y axis", ()  => {

        const chartDef = {
            data: {
                columnOrder: ["a", "b", "c", "d"],
                columnTypes: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                },
                index: {
                    type: "number",
                    values: [2, 3, 4],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 22,
                        d: 44,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 33,
                        d: 66,
                    },
                ],
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                        x: {
                            series: "c",
                        },
                    },
                    {
                        series: "b",
                        x: {
                            series: "d",
                        },
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef).toEqual({
            chart: {
                type: "line",
                width: defaultChartWidth,
                height: defaultChartHeight,
                animations: {
                    enabled: false,
                },
            },
            series: [
                {
                    name: "a",
                    data: [
                        {
                            x: 22,
                            y: 10,
                        }, 
                        {
                            x: 33,
                            y: 20, 
                        },
                    ],
                },
                {
                    name: "b",
                    data: [
                        {
                            x: 44,
                            y: 100,
                        }, 
                        {
                            x: 66,
                            y: 200, 
                        },
                    ],
                },
            ],
            yaxis: [
                {
                    opposite: false,
                },
                {
                    opposite: false,
                },
            ],
        });
    });

    /*fio:

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
