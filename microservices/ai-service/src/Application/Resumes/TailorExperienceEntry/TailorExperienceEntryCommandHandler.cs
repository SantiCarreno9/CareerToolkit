using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.Resumes.TailorExperienceEntry;
internal sealed class TailorExperienceEntryCommandHandler(
    IAiResumeService service)
    : ICommandHandler<TailorExperienceEntryCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorExperienceEntryCommand command, CancellationToken cancellationToken)
    {
        return await service.TailorExperienceEntry(command.Instruction, command.ExperienceEntry);
    }
}
