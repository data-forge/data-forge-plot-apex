import { mountChart } from "./index";

async function main(): Promise<void> {

    const response = await fetch("chart-def.json");
    const chartData = await response.json();
    await mountChart(chartData.chartDef, document.getElementById("chart")!, chartData.options);
}

main()
    .catch(err => {
        console.error("Error rendering chart.");
        console.error(err && err.stack || err);
    });
