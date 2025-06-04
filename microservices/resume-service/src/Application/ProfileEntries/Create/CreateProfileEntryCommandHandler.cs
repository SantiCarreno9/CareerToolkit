using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using SharedKernel;

namespace Application.ProfileEntries.Create;
internal sealed class CreateProfileEntryCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : ICommandHandler<CreateProfileEntryCommand, string>
{
    public async Task<Result<string>> Handle(CreateProfileEntryCommand command, CancellationToken cancellationToken)
    {
        if(userContext.UserId is null)
        {
            return Result.Failure<string>(ProfileEntryErrors.Unauthorized());
        }
        var profileEntry = new ProfileEntry
        {
            UserId = userContext.UserId,
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
