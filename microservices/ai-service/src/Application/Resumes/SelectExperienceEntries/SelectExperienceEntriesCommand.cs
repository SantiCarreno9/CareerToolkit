using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.Resumes.SelectExperienceEntries;
public sealed record SelectExperienceEntriesCommand(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries
    ) : ICommand<List<string>>;
