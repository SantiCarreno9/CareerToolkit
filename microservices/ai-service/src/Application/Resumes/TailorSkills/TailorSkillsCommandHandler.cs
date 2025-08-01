﻿using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using SharedKernel;

namespace Application.Resumes.TailorSkills;
internal sealed class TailorSkillsCommandHandler(
    IAIService service)
    : ICommandHandler<TailorSkillsCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorSkillsCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job:\n{command.Instruction.JobPosting}\n";

        prompt += "\nThese are my previous jobs:\n";
        foreach (ExperienceEntry item in command.ExperienceEntries)
        {
            prompt += $"{item.Title} with responsibilities: {item.Description}\n\n";
        }

        // Add instruction depending on type
        prompt += command.Instruction.AiInstructionType switch
        {
            AiInstruction.Generate => "\nBased on the job posting and my experience, summarize my skills into **exactly 2–3 grouped bullet points**. Only list bullet points.",

            AiInstruction.Tailor => "\nHere are my current skills:\n" + command.CurrentSkills +
                                    "\nRewrite them into **exactly 2–3 short bullet points**. Each bullet should **group similar skills** (e.g., Game Development, Tools, Collaboration). " +
                                    "Only return bullet points — **do not write any sentences or descriptions**. Use job-relevant keywords.",

            AiInstruction.Improve => "\nHere are my current skills:\n" + command.CurrentSkills +
                                     "\nRewrite them into **2–3 concise bullet points**, grouping related skills thematically. " +
                                     "⚠️ **Do NOT include full sentences. Do NOT describe me. Do NOT write a summary.** Only return short bullet points with grouped skills.",

            AiInstruction.Custom => command.Instruction.Instruction,

            _ => "\nSummarize my skills into **exactly 2–3 grouped bullet points**. Only list bullet points. Do not write paragraphs or sentences. Do not describe my background."
        };

        // Strong final instruction block
        string instruction = "You are a resume assistant. Respond ONLY with 2–3 short, structured bullet points, each starting with a bolded skill group (e.g., **Game Development**).\n" +
                            "Each bullet should list related skills after the colon. Do not use verbs or full sentences. Do NOT write a summary or description.\n" +
                            "One bullet must cover soft skills or workflow-related strengths.\n" +
                            "Be truthful and write the actual skills from my previous experience that are relevant to the job posting, don't just copy the skills mentioned on the job posting.\n" +
                            "Format: '**Group Name:** skill1, skill2, skill3'\n" +
                            "No paragraphs, no introductions, no full phrases.";

        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction) && command.Instruction.AiInstructionType != AiInstruction.Custom)
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
