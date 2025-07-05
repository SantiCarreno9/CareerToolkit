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

            AiInstruction.Custom => (!string.IsNullOrEmpty(command.CurrentSummary) ? "Here is my current summary: " + command.CurrentSummary + "\n" : "") +
            command.Instruction.Instruction,

            _ => "\nWrite a resume summary based on this information. It should be a short, professional paragraph (2–4 sentences)."
        };

        string instruction =
            "You are a resume assistant. Respond ONLY with a short professional summary in paragraph form for my resume.\n" +
            "Limit the summary to 2–4 sentences.\n" +
            "Focus on my actual experience, technical skills, and strengths that relate to the job.\n" +
            "Use clear, direct, and natural-sounding language.\n" +
            "DO NOT use buzzwords like 'showcasing', 'aligning', 'mirroring', 'demonstrating passion', or similar vague terms.\n" +
            "DO NOT reference the job posting, company, or role explicitly.\n" +
            "DO NOT say things like 'I am applying for' or 'this role'—this summary goes directly on the resume.\n" +
            "DO NOT use bullet points, lists, or headings.\n" +
            "Write in a neutral, professional tone.";


        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction) && command.Instruction.AiInstructionType != AiInstruction.Custom)
        {
            instruction += $"\n\nAdditional instructions with higher priority:\n{command.Instruction.Instruction}";
        }

        if (command.Instruction.AiInstructionType == AiInstruction.Custom)
        {
            instruction = "";
        }

        return await service.GenerateText<string>(new InstructionToAi(prompt, instruction));

    }
}
