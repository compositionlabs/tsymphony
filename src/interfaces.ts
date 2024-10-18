interface GenerateWorkflowRequest {
    task_description: string;
    parameters: Record<string, any>;
    tools: Array<string>;
}

interface AddWorkflowToolRequest {
    unique_id: string;
    name: string;
    description: string;
    schema: Record<string, any>;
}

interface WorkflowTool {
    id: string;
    unique_id: string;
    name: string;
    description: string;
    tool_type: string;
    schema: Record<string, any> | null;
    is_private: boolean;
    belongs_to_id: string | null;
}

interface WorkflowNode {
    id: string;
    step_index: number;
    input: string;
    job: string;
    output: string;
    prompt: string;
    dependencies: Array<number>;
    created_at: string;
    updated_at: string;
    tools: Array<WorkflowTool>;
}

interface Workflow {
    id: string;
    name: string;
    task_description: string;
    created_at: string;
    updated_at: string;
    parameters: Record<string, any>;
    nodes: Array<WorkflowNode>;
    belongs_to_id: string;
}

interface GetWorkflowsResponse {
    workflows: Array<Workflow>;
}

interface InitRunRequest {
    workflow_id: string;
    text_input: string;
}

interface InitRunResponse {
    run_id: string;
    workflow_id: string;
    input: string;
}

interface RunStepRequest {
    run_id: string;
    tool_calls: Array<any>;
}

interface RunStepResponse {
    run_id: string;
    input: string;
    status: string;
    tool_calls: Array<any>;
    ios: Record<string, any>;
}

export {
    GenerateWorkflowRequest,
    AddWorkflowToolRequest,
    InitRunRequest,
    RunStepRequest,
    Workflow,
    WorkflowNode,
    WorkflowTool,
    GetWorkflowsResponse,
    InitRunResponse,
    RunStepResponse
}