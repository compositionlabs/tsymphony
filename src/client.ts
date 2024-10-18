import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
import { settings } from './settings';
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

dotenv.config();

export class SymphonyClient {
    private apiKey: string;
    private baseUrl: string;
    private session: AxiosInstance;

    public tools: Array<WorkflowTool> = [];
    public workflows: Array<Workflow> = [];

    constructor(
        apiKey: string = settings.apiKey,
        baseUrl: string = settings.baseUrl,
        session?: AxiosInstance
    ) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.session = session || axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
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

    public async runStep(runStepRequest: RunStepRequest): Promise<RunStepResponse> {
        try {
            const res = await this.session.post(`${this.baseUrl}/inference/runner/runstep`, runStepRequest);
            return res.data;
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

    public async addTool(tool: AddWorkflowToolRequest): Promise<any> {
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

export const client = new SymphonyClient();
