import { IChartDef } from "@data-forge-plot/chart-def";
import { formatChartDef } from "./lib/format-chart-def";
export { formatChartDef } from "./lib/format-chart-def";
const ApexCharts = require("apexcharts").default;

//
// Interface to control and configure a mounted chart.
//
export interface IChart {

    //
    // Unmount the chart.
    //
    unmount(): void;

    //
    // Size the chart to fit its container.
    //
    sizeToFit(): void;
}

//
// Wrapper for an ApexCharts chart.
//
class ApexChart implements IChart {

    //
    // The ApexCharts chart object.
    //
    private chart?: ApexCharts;

    constructor(chart: ApexCharts) {
        this.chart = chart;
    }

    //
    // Unmount the chart.
    //
    public unmount(): void {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }

    //
    // Size the chart to fit its container.
    //
    public sizeToFit(): void {
        if (this.chart) {
            //todo: this.chart.resize();
        }
    }
}

//
// Mount the chart on the DOM element.
//
export async function mountChart(chartDef: IChartDef, domElement: HTMLElement): Promise<IChart> {
    const apexChartDef = formatChartDef(chartDef); //TODO: This can be properly typed to a apex chart configuration!
    const apexChart = new ApexCharts(domElement, apexChartDef);
    await apexChart.render();
    return new ApexChart(apexChart);
}