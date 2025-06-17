using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.Resumes.TailorSection;
internal sealed class TailorSectionCommandHandler(
    IAiResumeService service)
    : ICommandHandler<TailorSectionCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(TailorSectionCommand command, CancellationToken cancellationToken)
    {
        return await service.TailorSection(command.Instruction, command.SectionContent);
    }
}
