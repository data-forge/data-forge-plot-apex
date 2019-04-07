import { IChartDef, ISingleYAxisMap, ISingleAxisMap, IAxisConfig, IYAxisConfig, ChartType, IAxisMap } from "@data-forge-plot/chart-def";
import * as moment from "moment"; //fio: ???
import * as numeral from "numeral"; //fio: ???
import { ApexOptions } from "apexcharts";
import { ISerializedDataFrame } from "@data-forge/serialization";

//
// Extract a single named series from chart data.
//
function extractSingleSeries(columnName: string, values: any[], indexValues: any[]) {
    return values.map((row, index) => ({ x: indexValues[index], y: row[columnName] }));
}

//
// Extract series from the chart definition's data.
//
function extractSeries(data: ISerializedDataFrame, axisMap: IAxisMap): ApexAxisChartSeries {
    const columnNames = axisMap.y.map(axis => axis.series);
    return columnNames.map(columnName => ({ 
        name: columnName, 
        data: extractSingleSeries(columnName, data.values, data.index.values),
    }));
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
    return {
        chart: {
            type: inputChartDef.plotConfig.chartType,
            width: valueOrDefault<number>(inputChartDef.plotConfig.width, 1200),
            height: valueOrDefault<number>(inputChartDef.plotConfig.height, 600),
            animations: {
                enabled: false,
            },
        },
        series: extractSeries(inputChartDef.data, inputChartDef.axisMap),
    };
}
