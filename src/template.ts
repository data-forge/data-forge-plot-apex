import { mountChart } from "./index";

async function main(): Promise<void> {

    //todo: disable animation and interactivity!!

    const response = await fetch("chart-def.json");
    const chartDef = await response.json();
    await mountChart(chartDef, document.getElementById("chart")!, { makeStatic: true });
}

main()
    .catch(err => {
        console.error("Error rendering chart.");
        console.error(err && err.stack || err);
    });
