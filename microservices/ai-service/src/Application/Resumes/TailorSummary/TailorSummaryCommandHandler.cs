using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using SharedKernel;

namespace Application.Resumes.TailorSummary;
internal sealed class TailorSummaryCommandHandler(
    IAiResumeService service)
    : ICommandHandler<TailorSummaryCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorSummaryCommand command, CancellationToken cancellationToken)
    {
        return await service.TailorSummary(command.Instruction, command.ExperienceEntries, command.CurrentSummary);
    }
}
