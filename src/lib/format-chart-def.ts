import { IChartDef, ISingleYAxisMap, ISingleAxisMap, IAxisConfig, IYAxisConfig, ChartType, IAxisMap } from "@data-forge-plot/chart-def";
import * as moment from "moment"; //fio: ???
import * as numeral from "numeral"; //fio: ???
import { ApexOptions } from "apexcharts";
import { ISerializedDataFrame } from "@data-forge/serialization";

//
// Pluck a single named series from chart data.
//
function pluckValues(columnName: string, values: any[]) {
    return values.map(row => row[columnName]);
}

//
// Build a series for Apex cahrts.
//
function buildApexSeries(columnName: string, values: any[], indexValues: any[]) {
    return pluckValues(columnName, values)
        .map((yValue, index) => ({ x: indexValues[index], y: yValue }));
}

//
// Extract series from the chart definition's data.
//
function extractSeries(data: ISerializedDataFrame, axises: ISingleYAxisMap[], xAxis?: ISingleAxisMap): ApexAxisChartSeries {
    return axises.map(axis => {
        const columnName = axis.series;
        const xAxisColumnName = axis.x && axis.x.series || xAxis && xAxis.series;
        const xAxisValues = xAxisColumnName ? pluckValues(xAxisColumnName, data.values) : data.index.values;
        return {
            name: columnName, 
            data: buildApexSeries(columnName, data.values, xAxisValues),
        };
    });
}

//
// Get the configuration Y axis for apex.
//
function extractYAxisConfiguration(axises: ISingleYAxisMap[], opposite: boolean): ApexYAxis[] {
    return axises.map(axis => ({ opposite }));
}

//
// Get the value or if undefined, provide the default.
//
function valueOrDefault<T>(value: T | undefined, defaultValue: T): T {
    return value !== undefined && value || defaultValue;
}

/**
 * Convert a data-forge-plot chart definition to an ApexCharts chart definition.
 */
export function formatChartDef(inputChartDef: IChartDef): ApexOptions {
    const yAxisSeries = extractSeries(inputChartDef.data, inputChartDef.axisMap.y, inputChartDef.axisMap.x)
        .concat(extractSeries(inputChartDef.data, inputChartDef.axisMap.y2, inputChartDef.axisMap.x));

    const yAxisConfig = extractYAxisConfiguration(inputChartDef.axisMap.y, false)
        .concat(extractYAxisConfiguration(inputChartDef.axisMap.y2, true));

    return {
        chart: {
            type: inputChartDef.plotConfig.chartType,
            width: valueOrDefault<number|string>(inputChartDef.plotConfig.width, "100%"),
            height: valueOrDefault<number|string>(inputChartDef.plotConfig.height, "100%"),
            animations: {
                enabled: false,
            },
        },
        series: yAxisSeries,
        yaxis: yAxisConfig,
    };
}
