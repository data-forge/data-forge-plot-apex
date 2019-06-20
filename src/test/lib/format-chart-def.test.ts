import "jest";
import { IChartDef, AxisType, ChartType, ILegendConfig, IYAxisSeriesConfig } from "@data-forge-plot/chart-def";
import { formatChartDef } from "../../lib/format-chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";
import * as Sugar from "sugar";

describe("format chart def", () => {

    const oneColumnTestData = {
        columnOrder: ["x"],
        columns: {
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
    };

    const twoColumnTestData = {
        columnOrder: ["a", "b"],
        columns: {
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
    };

    const fourColumnTestData = {
        columnOrder: ["a", "b", "c", "d"],
        columns: {
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
    };

    function makeChartDef(inputChartDef?: any): IChartDef {
        const chartDef: any = {
            plotConfig: {
                chartType: inputChartDef && inputChartDef.chartType || "line",
                width: inputChartDef && inputChartDef.width,
                height: inputChartDef && inputChartDef.height,
                x: inputChartDef && inputChartDef.plotConfig && inputChartDef.plotConfig.x,
                y: inputChartDef && inputChartDef.plotConfig && inputChartDef.plotConfig.y,
                y2: inputChartDef && inputChartDef.plotConfig && inputChartDef.plotConfig.y2,
                legend: inputChartDef && inputChartDef.plotConfig  && inputChartDef.plotConfig.legend,
                dataLabels: inputChartDef && inputChartDef.plotConfig && inputChartDef.plotConfig.dataLabels,
            },
            data: inputChartDef && inputChartDef.data || {
                columnOrder: [],
                columns: [],
                index: {},
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

    it("width and height are passed through if supplied", () => {
        
        const width = 22;
        const height = 53;
        const apexChartDef = formatChartDef(makeChartDef({ width, height }));
        expect(apexChartDef.chart!.width).toBe(width);
        expect(apexChartDef.chart!.height).toBe(height);
    });
    
    it("can plot single series with default index", () => {

        const chartDef = {
            data: oneColumnTestData,
            axisMap: {
                y: [
                    {
                        series: "x",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("can plot multiple series with default index", () => {

        const chartDef = {
            data: twoColumnTestData,
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
        expect(apexChartDef.series).toEqual([
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
        ]);
    });
    
    it("can pluck named series for y axis", () => {

        const chartDef = {
            data: twoColumnTestData,
            axisMap: {
                y: [
                    {
                        series: "b",
                    },
                ],
            },
        };

        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("can pluck named series for x axis", ()  => {

        const chartDef = {
            data: twoColumnTestData,
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
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("can pluck named series for second y axis", ()  => {

        const chartDef = {
            data: twoColumnTestData,
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
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("can pluck multiple named series for second y axis", ()  => {

        const chartDef = {
            data: twoColumnTestData,
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
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("can set x axis per y axis", ()  => {

        const chartDef = {
            data: fourColumnTestData,
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
        expect(apexChartDef.series).toEqual([
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
        ]);
    });

    it("second y axis is on opposite side", ()  => {

        const chartDef = {
            data: oneColumnTestData,
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

        const yaxis = formatChartDef(makeChartDef(chartDef)).yaxis as ApexYAxis[];
        expect(yaxis.length).toEqual(2);
        expect(yaxis[0].opposite).toEqual(false);
        expect(yaxis[1].opposite).toEqual(true);
    });

    it("subsequent y axis are not shown", ()  => {

        const chartDef = {
            data: fourColumnTestData,
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                    {
                        series: "c",
                    },
                ],
            },
        };

        const yaxis = formatChartDef(makeChartDef(chartDef)).yaxis as ApexYAxis[];
        expect(yaxis.length).toEqual(3);
        expect(yaxis[0].show).toEqual(true);
        expect(yaxis[1].show).toEqual(false);
        expect(yaxis[2].show).toEqual(false);
    });

    it("subsequent y2 axis are not shown", ()  => {

        const chartDef = {
            data: fourColumnTestData,
            axisMap: {
                y2: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                    {
                        series: "c",
                    },
                ],
            },
        };

        const yaxis = formatChartDef(makeChartDef(chartDef)).yaxis as ApexYAxis[];
        expect(yaxis.length).toEqual(3);
        expect(yaxis[0].show).toEqual(true);
        expect(yaxis[1].show).toEqual(false);
        expect(yaxis[2].show).toEqual(false);
    });

    it("can set min and max values for both y axises", ()  => {

        const chartDef = {
            data: oneColumnTestData,
            plotConfig: {
                y: {
                    min: 15,
                    max: 25,
                },
                y2: {
                    min: 0,
                    max: 400,
                },
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

        const yaxis = formatChartDef(makeChartDef(chartDef)).yaxis as ApexYAxis[];
        expect(yaxis.length).toEqual(2);
        expect(yaxis[0].min).toEqual(15);
        expect(yaxis[0].max).toEqual(25);
        expect(yaxis[1].min).toEqual(0);
        expect(yaxis[1].max).toEqual(400);
    });

    it("stroke width defaults to 1", () => {
        
        const apexChartDef = formatChartDef(makeChartDef());
        expect(apexChartDef.stroke!.width).toBe(1);
    });

    it("using a datetime index for the x axis sets the apex datatype to datetime", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "number",
            },
            index: {
                type: "date",
                values: [
                    new Date("2018/01/01"), 
                    new Date("2018/01/02"),
                ],
            },
            values: [
                {
                    A: 10,
                },
                {
                    A: 20,
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data }));
        expect(apexChartDef.xaxis!.type).toBe("datetime");
    });

    it("using a numeric index for the x axis sets the apex datatype to numeric", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "number",
            },
            index: {
                type: "number",
                values: [
                    100, 
                    200,
                ],
            },
            values: [
                {
                    A: 10,
                },
                {
                    A: 20,
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data }));
        expect(apexChartDef.xaxis!.type).toBe("numeric");
    });

    it("using a strings index for the x axis sets the apex datatype to category", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "number",
            },
            index: {
                type: "string",
                values: [
                    "a",
                    "b",
                ],
            },
            values: [
                {
                    A: 10,
                },
                {
                    A: 20,
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data }));
        expect(apexChartDef.xaxis!.type).toBe("category");
    });

    it("using a datetime column for the x axis sets the apex datatype to datetie", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "date",
            },
            index: {
                type: "number",
                values: [ 1, 2 ],
            },
            values: [
                {
                    A: new Date("2018/01/01"),
                },
                {
                    A: new Date("2018/01/02"),
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data, axisMap: { x: { series: "A" }} }));
        expect(apexChartDef.xaxis!.type).toBe("datetime");
    });

    it("using a numeric column for the x axis sets the apex datatype to numeric", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "number",
            },
            index: {
                type: "number",
                values: [ 1, 2 ],
            },
            values: [
                {
                    A: 10,
                },
                {
                    A: 20,
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data, axisMap: { x: { series: "A" }} }));
        expect(apexChartDef.xaxis!.type).toBe("numeric");
    });

    it("using a strings column for the x axis sets the apex datatype to category", () => {

        const data: ISerializedDataFrame = {
            columnOrder: [ "A" ],
            columns: { 
                A: "string",
            },
            index: {
                type: "number",
                values: [ 1, 2 ],
            },
            values: [
                {
                    A: "a",
                },
                {
                    A: "b",
                },
            ],
        };
        const apexChartDef = formatChartDef(makeChartDef({ data, axisMap: { x: { series: "A" }} }));
        expect(apexChartDef.xaxis!.type).toBe("category");
    });

    it("data labels are disabled", () => {
        const apexChartDef = formatChartDef(makeChartDef());
        expect(apexChartDef.dataLabels!.enabled).toBe(false);
    });

    it("legend defaults to true", () => {
        expect(formatChartDef(makeChartDef()).legend!.show).toBe(true);
        expect(formatChartDef(makeChartDef({ legend: {  } })).legend!.show).toBe(true);
    });

    it("can show legend", () => {
        const apexChartDef = formatChartDef(makeChartDef({ plotConfig: { legend: { show: true }}}));
        expect(apexChartDef.legend!.show).toBe(true);
    });

    it("can hide legend", () => {
        const apexChartDef = formatChartDef(makeChartDef({ plotConfig: { legend: { show: false }}}));
        expect(apexChartDef.legend!.show).toBe(false);
    });

    it("can set font style for legend", () => {
        const chartDef = {
            plotConfig: {
                legend: {
                    font: {
                        size: "10px",
                        family: "Arial",
                    },
                },
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef.legend!.fontSize).toBe("10px");
        expect(apexChartDef.legend!.fontFamily).toBe("Arial");
    });

    it("can set label for xaxis", () => {
        const chartDef = {
            plotConfig: {
                x: {
                    label: {
                        text: "A great label",                       
                    },
                },
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef.xaxis!.title!.text).toBe("A great label");
    });

    it("can set font style for xaxis", () => {
        const chartDef = {
            plotConfig: {
                x: {
                    label: {
                        font: {
                            size: "10px",
                            family: "Arial",
                        },
                    },
                },
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        const style: any = apexChartDef.xaxis!.title!.style!; //TODO: Typecast to any due to out of date types in ApexCharts.
        expect(style.fontSize).toBe("10px");
        expect(style.fontFamily).toBe("Arial");
    });

    it("can set label for first yaxis", () => {
        const chartDef = {
            data: oneColumnTestData,
            plotConfig: {
                y: {
                    label: {
                        text: "A great label",                       
                    },
                },
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
        expect((apexChartDef.yaxis as ApexYAxis[])[0].title!.text).toBe("A great label");
    });

    it("can set font style for first yaxis", () => {
        const chartDef = {
            data: oneColumnTestData,
            plotConfig: {
                y: {
                    label: {
                        font: {
                            size: "12px",
                            family: "Courier New",
                        },
                    },
                },
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
        const style = (apexChartDef.yaxis as ApexYAxis[])[0].title!.style!;
        expect(style.fontSize).toBe("12px");
        expect(style.fontFamily).toBe("Courier New");
    });

    it("can set label for 2nd yaxis", () => {
        const chartDef = {
            data: oneColumnTestData,
            plotConfig: {
                y2: {
                    label: {
                        text: "A great label",                       
                    },
                },
            },
            axisMap: {
                y2: [
                    {
                        series: "x",
                    },
                ],
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect((apexChartDef.yaxis as ApexYAxis[])[0].title!.text).toBe("A great label");
    });

    it("can set font style for 2nd yaxis", () => {
        const chartDef = {
            data: oneColumnTestData,
            plotConfig: {
                y2: {
                    label: {
                        font: {
                            size: "13px",
                            family: "Times New Roman",
                        },
                    },
                },
            },
            axisMap: {
                y2: [
                    {
                        series: "x",
                    },
                ],
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        const style = (apexChartDef.yaxis as ApexYAxis[])[0].title!.style!;
        expect(style.fontSize).toBe("13px");
        expect(style.fontFamily).toBe("Times New Roman");
    });

    it("can configure font style for data labels", () => {
        const chartDef = {
            plotConfig: {
                dataLabels: {
                    font: {
                        size: "22px",
                        family: "The best font",
                    },
                },
            },
        };
        const apexChartDef = formatChartDef(makeChartDef(chartDef));
        expect(apexChartDef.dataLabels!.enabled).toBe(true); //TODO: Also want an explicit way to enable disable data labels.
        const style = apexChartDef.dataLabels!.style!;
        expect(style.fontSize).toBe("22px");
        expect(style.fontFamily).toBe("The best font");
    });
});
