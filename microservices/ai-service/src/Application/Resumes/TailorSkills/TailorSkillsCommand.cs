using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.Resumes.TailorSkills;
public sealed record TailorSkillsCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSkills
    ) : ICommand<List<string>>;
