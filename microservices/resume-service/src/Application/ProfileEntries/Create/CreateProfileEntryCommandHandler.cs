using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using SharedKernel;

namespace Application.ProfileEntries.Create;
internal sealed class CreateProfileEntryCommandHandler(
    IApplicationDbContext context)
    : ICommandHandler<CreateProfileEntryCommand, string>
{
    public async Task<Result<string>> Handle(CreateProfileEntryCommand command, CancellationToken cancellationToken)
    {
        var profileEntry = new ProfileEntry
        {
            UserName = command.UserName,
            Title = command.Title,
            Organization = command.Organization,
            Location = command.Location,
            StartDate = command.StartDate,
            EndDate = command.EndDate,
            IsCurrent = command.IsCurrent,
            Description = command.Description,
            Category = command.Category
        };

        context.ProfileEntries.Add(profileEntry);

        await context.SaveChangesAsync(cancellationToken);

        return profileEntry.Id;
    }
}
