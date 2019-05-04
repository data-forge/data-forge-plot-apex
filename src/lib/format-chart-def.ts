import { IChartDef, IAxisConfig, IYAxisConfig, ChartType, IAxisMap, IAxisSeriesConfig, IYAxisSeriesConfig } from "@data-forge-plot/chart-def";
import { ApexOptions } from "apexcharts";
import { ISerializedDataFrame } from "@data-forge/serialization";
import * as dayjs from "dayjs";
import * as numeral from "numeral";

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
function extractSeries(data: ISerializedDataFrame, axises: IYAxisSeriesConfig[], xAxis?: IAxisSeriesConfig): ApexAxisChartSeries {
    return axises.map(seriesConfig => {
        const columnName = seriesConfig.series;
        const xAxisColumnName = seriesConfig.x && seriesConfig.x.series || xAxis && xAxis.series;
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
function extractYAxisConfiguration(seriesConfigs: IYAxisSeriesConfig[], axisConfig: IYAxisConfig, opposite: boolean, data: ISerializedDataFrame): ApexYAxis[] {
    let show: boolean = true;
    return seriesConfigs.map(seriesConfig => {    
        const yAxisConfig: ApexYAxis = { 
            opposite, 
            show,
            min: axisConfig.min,
            max: axisConfig.max,
            labels: {
            },
        };

        const formatString = axisConfig.format;
        if (formatString) {
            const columnName = seriesConfig.series;
            const dataType = data.columns[columnName];
            if (dataType === "date") {
                yAxisConfig.labels!.formatter = value => dayjs(value).format(formatString);
            }
            else if (dataType === "number") {
                yAxisConfig.labels!.formatter = value => numeral(value).format(formatString);
            }
        }

        show = false;
        return yAxisConfig;
    });
}

//
// Determine the Apex type to use for the x axis.
//
function determineXAxisType(inputChartDef: IChartDef): "datetime" | "numeric" | "categories" {
    const dataType = inputChartDef.axisMap.x && inputChartDef.axisMap.x.series && inputChartDef.data.columns[inputChartDef.axisMap.x.series] || inputChartDef.data.index.type;
    if (dataType === "date") {
        return "datetime";
    }
    else if (dataType === "number") {
        return "numeric";
    }
    else {
        return "categories";
    }
}

/**
 * Convert a data-forge-plot chart definition to an ApexCharts chart definition.
 */
export function formatChartDef(inputChartDef: IChartDef): ApexOptions {

    //todo: use the serialization library to deserialize the chart def here!

    const xaxisType = determineXAxisType(inputChartDef);
    const xaxis: ApexXAxis = {
        type: xaxisType,
        labels: {

        },
    };

    const xAxisFormatString = inputChartDef.plotConfig.x && inputChartDef.plotConfig.x.format;
    if (xAxisFormatString) {
        if (xaxisType === "datetime") {
            xaxis.labels!.formatter = value => dayjs(value).format(xAxisFormatString);
        }
        else if (xaxisType === "numeric") {
            xaxis.labels!.formatter = value => numeral(value).format(xAxisFormatString);
        }
    }

    const yAxisSeries = extractSeries(inputChartDef.data, inputChartDef.axisMap.y, inputChartDef.axisMap.x)
        .concat(extractSeries(inputChartDef.data, inputChartDef.axisMap.y2, inputChartDef.axisMap.x));

    const yAxisConfig = extractYAxisConfiguration(inputChartDef.axisMap.y, inputChartDef.plotConfig.y || {}, false, inputChartDef.data)
        .concat(extractYAxisConfiguration(inputChartDef.axisMap.y2, inputChartDef.plotConfig.y2 || {}, true, inputChartDef.data));

    return {
        chart: {
            type: inputChartDef.plotConfig.chartType,
            width: inputChartDef.plotConfig.width,
            height: inputChartDef.plotConfig.height,
        },
        stroke: {
            width: 1,
        },
        series: yAxisSeries,
        yaxis: yAxisConfig,
        xaxis,
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: inputChartDef.plotConfig.legend && inputChartDef.plotConfig.legend.show !== undefined
                ?  inputChartDef.plotConfig.legend.show
                : true,
        },
    };
}
