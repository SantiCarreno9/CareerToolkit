using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using SharedKernel;

namespace Application.Resumes.TailorSummary;
internal sealed class TailorSummaryCommandHandler(
    IAIService service)
    : ICommandHandler<TailorSummaryCommand, string>
{
    public async Task<Result<string>> Handle(TailorSummaryCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job: {command.Instruction.JobPosting}";

        prompt += "\n\nThese are my previous jobs:\n";
        foreach (ExperienceEntry item in command.ExperienceEntries)
        {
            prompt += $"{item.Title} with responsibilities: {item.Description}\n\n";
        }

        prompt += command.Instruction.AiInstructionType switch
        {
            AiInstruction.Generate =>
                "\nBased on the job posting and my previous experience, generate a strong resume summary in paragraph form. " +
                "It should be 2–4 concise sentences focused on my experience, strengths, and job-relevant skills. " +
                "Do not include bullet points. Use professional and clear language.",

            AiInstruction.Tailor =>
                "\nHere is my current summary:\n" + command.CurrentSummary +
                "\nTailor this summary to better align with the job posting and my previous experience. Make it concise and professional, in paragraph form.",

            AiInstruction.Improve =>
                "\nHere is my current summary:\n" + command.CurrentSummary +
                "\nImprove this summary to sound more polished and impactful, while keeping the general content. Keep it in paragraph format.",

            AiInstruction.Custom => command.Instruction.Instruction,

            _ => "\nWrite a resume summary based on this information. It should be a short, professional paragraph (2–4 sentences)."
        };

        // ✅ Update this instruction block for paragraph summaries
        string instruction =
        "You are a resume assistant. Respond ONLY with a short professional summary in paragraph form.\n" +
        "Limit the summary to 2–4 sentences.\n" +
        "Focus on relevant experience, key strengths, and technical qualifications that match the job.\n" +
        "Use clear, direct language. Avoid buzzwords and fluff.\n" +
        "Do NOT use bullet points, lists, or headings.";

        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction) && command.Instruction.AiInstructionType != AiInstruction.Custom)
        {
            instruction += $"\n\nAdditional instructions:\n{command.Instruction.Instruction}";
        }

        return await service.GenerateText<string>(new InstructionToAi(prompt, instruction));

    }
}
