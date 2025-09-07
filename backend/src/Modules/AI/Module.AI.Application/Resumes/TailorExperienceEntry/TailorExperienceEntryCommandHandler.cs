using Module.AI.Application.Abstractions.AIService;
using Module.AI.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.TailorExperienceEntry;
internal sealed class TailorExperienceEntryCommandHandler(
    IAIService service)
    : ICommandHandler<TailorExperienceEntryCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorExperienceEntryCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job: {command.Instruction.JobPosting}";
        prompt += $"\n\n These are my responsibilities from a previous job: {command.ExperienceEntry.Description} \n";

        prompt += command.Instruction.AiInstructionType switch
        {
            AiInstruction.Generate => "Generate points that describe this experience in a compelling way relevant to the job posting.\n",
            AiInstruction.Tailor => "Rewrite the responsibilities to better match the job posting. Highlight relevant keywords and required skills.\n",
            AiInstruction.Improve => "Improve the wording of the responsibilities. Make them more concise, professional, and results-oriented.\n",
            AiInstruction.Custom => $"{command.Instruction.Instruction}",
            _ => "Summarize the experience in three clear and concise bullet points.\n",
        };

        string instruction = "\"You are a resume assistant who writes resumes that stand out and ALWAYS passes the ATS filters. Always respond in short, impactful bullet points. " +
            "Start with a strong action verb, avoid fluff, and have keywords highlighted when applicable." +
            "These points will be used directly in a resume so it needs to pass the ATS filters, ALWAYS keep it in mind. \r\nDo NOT refer to the job posting or company." +
            "\r\nAvoid all direct or indirect references like:\r\n“aligning,” “mirroring,” “showcasing,” “highlighting,” “tailored,” “demonstrates,” “with the goal of,” or anything similar." +
            "\r\nFocus only on what I did, how I did it, and the tools or outcomes, using clear and direct language.\r\nWrite in past tense, with concise and action-based phrasing.";
        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction))
        {
            instruction += $"\n\nAdditional instructions with higher priority:\n{command.Instruction.Instruction}";
        }
        if (command.Instruction.AiInstructionType == AiInstruction.Custom)
        {
            instruction = "";
        }
        return await service.GenerateText<List<string>>(new InstructionToAi(prompt, instruction));
    }
}
