using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.Resumes.TailorSection;
public sealed record TailorSectionCommand(
    ResumeInstruction Instruction,
    string SectionContent
    ) : ICommand<List<string>>;
