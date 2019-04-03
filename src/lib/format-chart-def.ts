import { IChartDef, ISingleYAxisMap, ISingleAxisMap, IAxisConfig, IExpandedAxisConfig, IExpandedYAxisConfig, ChartType } from "@data-forge-plot/chart-def";
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
function extractAllSeries(data: ISerializedDataFrame): ApexAxisChartSeries {
    return data.columnOrder.map(columnName => ({ 
        name: columnName, 
        data: extractSingleSeries(columnName, data.values, data.index.values),
    }));
}

/**
 * Convert a data-forge-plot chart definition to an ApexCharts chart definition.
 */
export function formatChartDef(inputChartDef: IChartDef): ApexOptions {
    return {
        chart: {
            type: inputChartDef.plotConfig.chartType,
        },
        series: extractAllSeries(inputChartDef.data),
    };
}
