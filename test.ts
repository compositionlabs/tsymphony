// import { SymphonyClient } from "./src/client";
import * as dotenv from "dotenv";
import { SymphonyClient } from "tsymphony";

dotenv.config();

if (!process.env.SYMPHONY_API_KEY) {
    throw new Error("SYMPHONY_API_KEY is not set");
}
if (!process.env.SYMPHONY_BASE_URL) {
    throw new Error("SYMPHONY_BASE_URL is not set");
}

const function_test = () => {
    return "This is a test tool from ts";
};

SymphonyClient.create(
    process.env.SYMPHONY_API_KEY,
    process.env.SYMPHONY_BASE_URL
).then((client) => {
    client.addLocalTool("test_tool_from_ts", "This is a test tool from ts", function_test).then(() => {
        console.log("Tool added");
    });
    console.log(client.tools);
});

// client.getTools().then((tools) => {
//     console.log(tools);
// });

// client.generateWorkflow({
//     tools: ["pplx_online"],
//     parameters: {"max_steps": 1},
//     task_description: "For a given country, find the latest news articles and summarize them into a single paragraph.",
// }).then((workflow) => {
//     console.log(workflow);
//     client.initRun({
//         workflow_id: workflow.id,
//         text_input: "Colombia",
//     }).then(async (run) => {
//         console.log(run);
//         let shouldBreak = false;
//         while (!shouldBreak) {
//             const runStep = await client.runStep({
//                 run_id: run.run_id,
//                 tool_calls: run.tool_calls
//             });
//             console.log(runStep);
//             if (runStep.status === "completed") {
//                 shouldBreak = true;
//             }
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }).catch((error) => {
//     console.error(error);
// });
