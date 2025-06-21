using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Domain.Entities;
using SharedKernel;

namespace Application.Resumes.TailorExperienceEntry;
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
            AiInstruction.Generate => "Generate three bullet points that describe this experience in a compelling way.",
            AiInstruction.Tailor => "Rewrite the responsibilities to better match the job posting. Highlight relevant keywords and required skills.",
            AiInstruction.Improve => "Improve the wording of the responsibilities. Make them more concise, professional, and results-oriented.",
            AiInstruction.Custom => $"{command.Instruction.Instruction}",
            _ => "Summarize the experience in three clear and concise bullet points.",
        };

        prompt += "\n Try to limit them to 3 bullet items.";
        
        string instruction = "\"You are a resume assistant. Always respond in short, impactful bullet points. Each point must be under 15 words, start with an action verb, and have keywords highlighted when applicable.";
        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction))
        {
            instruction += $"\n\nAdditional instructions:\n{command.Instruction.Instruction}";
        }
        return await service.GenerateText<List<string>>(new InstructionToAi(prompt, instruction));
    }
}
