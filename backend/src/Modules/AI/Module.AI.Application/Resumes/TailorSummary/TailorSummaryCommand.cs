using Module.AI.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.TailorSummary;
public sealed record TailorSummaryCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSummary
    ) : ICommand<string>;
