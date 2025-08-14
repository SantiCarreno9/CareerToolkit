using Module.AI.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.SelectExperienceEntries;
public sealed record SelectExperienceEntriesCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries
    ) : ICommand<List<string>>;
