using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.Resumes.SelectExperienceEntries;
internal sealed class SelectExperienceEntriesCommandHandler(
    IAiResumeService service)
    : ICommandHandler<SelectExperienceEntriesCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(SelectExperienceEntriesCommand command, CancellationToken cancellationToken)
    {
        return await service.SelectExperienceEntries(command.Instruction,command.ExperienceEntries);
    }
}
