using Module.AI.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.TailorExperienceEntry;
public sealed record TailorExperienceEntryCommand(    
    ResumeInstruction Instruction,
    ExperienceEntry ExperienceEntry    
    ) : ICommand<List<string>>;
