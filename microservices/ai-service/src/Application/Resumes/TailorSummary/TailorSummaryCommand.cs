using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.Resumes.TailorExperienceEntry;
public sealed record TailorSummaryCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSummary
    ) : ICommand<List<string>>;
