using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.Resumes.TailorExperienceEntry;
public sealed record TailorExperienceEntryCommand(    
    ResumeInstruction Instruction,
    ExperienceEntry ExperienceEntry    
    ) : ICommand<List<string>>;
