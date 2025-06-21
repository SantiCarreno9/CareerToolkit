using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using SharedKernel;

namespace Application.Resumes.TailorSummary;
internal sealed class TailorSummaryCommandHandler(
    IAIService service)
    : ICommandHandler<TailorSummaryCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorSummaryCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job: {command.Instruction.JobPosting}";
        prompt += $"\n\n These are my previous jobs:\n";
        foreach (ExperienceEntry item in command.ExperienceEntries)
        {
            prompt += $"{item.Title} with responsibilities: {item.Description}\n\n";
        }
        prompt += command.Instruction.AiInstructionType switch
        {
            AiInstruction.Generate => "\nBased on the job posting and my previous experience, generate a strong professional summary I can use on my resume. Keep it concise, 3-4 sentences, and focused on my qualifications.",
            AiInstruction.Tailor => "\nHere is my current summary:\n" + command.CurrentSummary +
            "\nTailor this summary to better align with the job posting and my previous experience. Emphasize relevance and strengths related to the position.",
            AiInstruction.Improve => "\nHere is my current summary:\n" + command.CurrentSummary +
                             "\nImprove this summary to sound more impactful and polished while keeping the same general content.",
            AiInstruction.Custom => $"{command.Instruction.Instruction}",
            _ => "\nWrite a resume summary based on this information.",
        };

        prompt += "\n Please always try to highlight keywords relevant to the job";
        string instruction = "\"You are a resume assistant. Always respond in short, impactful bullet points. Each point must be under 15 words, start with an action verb, and have keywords highlighted when applicable.";
        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction) && command.Instruction.AiInstructionType != AiInstruction.Custom)
        {
            instruction += $"\n\nAdditional instructions:\n{command.Instruction.Instruction}";
        }
        return await service.GenerateText<List<string>>(new InstructionToAi(prompt, instruction));
    }
}
