using Module.AI.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.TailorSkills;
public sealed record TailorSkillsCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSkills
    ) : ICommand<List<string>>;
