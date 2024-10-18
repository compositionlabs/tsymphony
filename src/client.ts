import axios, { AxiosInstance } from 'axios';
import {
    GenerateWorkflowRequest,
    InitRunRequest,
    RunStepRequest,
    Workflow,
    WorkflowTool,
    GetWorkflowsResponse,
    InitRunResponse,
    RunStepResponse,
    AddWorkflowToolRequest,
} from './interfaces';

const BASE_URL = "http://127.0.0.1:8000";

export class SymphonyClient {
    private baseUrl: string;
    private session: AxiosInstance;

    public tools: Array<WorkflowTool> = [];
    public workflows: Array<Workflow> = [];

    public local_tools: Array<(...args: any[]) => string> = [];

    constructor(
        apiKey: string,
        baseUrl?: string,
        session?: AxiosInstance
    ) {
        if (!apiKey) {
            throw new Error("SYMPHONY_API_KEY is not set");
        }
        if (!baseUrl) {
            this.baseUrl = BASE_URL;
        } else {
            this.baseUrl = baseUrl;
        }
        this.session = session || axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
    }

    public static async create(
        apiKey: string,
        baseUrl?: string,
        session?: AxiosInstance
    ): Promise<SymphonyClient> {
        const client = new SymphonyClient(apiKey, baseUrl, session);
        await client.getTools();
        return client;
    }

    public async addLocalTool(unique_id: string, description: string, tool: (...args: any[]) => string) {
        if (this.tools.find((t) => t.unique_id === unique_id)) {
            this.local_tools.push(tool);
            return;
        } else {
            await this.addTool({
                unique_id: unique_id,
                description: description
            });
            this.local_tools.push(tool);
            return;
        }
    }

    public async generateWorkflow(workflow: GenerateWorkflowRequest): Promise<any> {
        try {
            const res = await this.session.post(`${this.baseUrl}/inference/planner/generateworkflow`, workflow);
            this.workflows.push(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getWorkflows(): Promise<GetWorkflowsResponse> {
        try {
            const res = await this.session.get(`${this.baseUrl}/inference/planner/getworkflows`);
            this.workflows = res.data.workflows;
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async initRun(initRunRequest: InitRunRequest): Promise<InitRunResponse> {
        try {
            const res = await this.session.post(`${this.baseUrl}/inference/runner/initrun`, initRunRequest);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async callLocalTool(unique_id: string, args: any[]) {
        const tool = this.local_tools.find((t) => t.name === unique_id);
        if (!tool) {
            throw new Error(`Tool with unique_id ${unique_id} not found`);
        } else {
            return tool(...args);
        }
    }

    public async runStep(runStepRequest: RunStepRequest): Promise<RunStepResponse> {
        try {
            const res = await this.session.post(`${this.baseUrl}/inference/runner/runstep`, runStepRequest);
            const data = res.data;
            if (data.tool_calls) {
                for (const tool_call_id in data.tool_calls) {
                    const tool_call = data.tool_calls[tool_call_id];
                    const tool_name = tool_call.name;
                    const tool_args = JSON.parse(tool_call.input);
                    const tool_result = await this.callLocalTool(tool_name, tool_args);
                    tool_call.output = tool_result;
                }
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getTools(): Promise<Array<WorkflowTool>> {
        try {
            const res = await this.session.get(`${this.baseUrl}/inference/tools/list`);
            this.tools = res.data;
            return this.tools;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async addTool(tool: AddWorkflowToolRequest): Promise<any> {
        tool.name = tool.unique_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        tool.schema = {'properties': {}, 'title': tool.name, 'type': 'object'};
        try {
            const res = await this.session.post(`${this.baseUrl}/inference/tools/add`, tool);
            this.tools.push(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
