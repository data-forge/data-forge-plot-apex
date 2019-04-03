import { mountChart } from "./index";

async function main(): Promise<void> {

    const response = await fetch("chart-def.json");
    const chartDef = await response.json();
    await mountChart(chartDef, document.getElementById("chart")!);
}

main()
    .catch(err => {
        console.error("Error rendering chart.");
        console.error(err && err.stack || err);
    });
