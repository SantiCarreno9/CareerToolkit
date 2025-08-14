using Module.AI.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.AI.Application.Resumes.TailorSection;
public sealed record TailorSectionCommand(
    ResumeInstruction Instruction,
    string SectionContent
    ) : ICommand<string>;
