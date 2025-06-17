import { AiInstructionType } from "../../../core/models/ai-instruction-type";


export interface AiInstruction {    
    instruction: string;
    aiInstructionType: AiInstructionType;
};

export interface AiResumeInstruction extends AiInstruction {
    jobPosting: string;
}