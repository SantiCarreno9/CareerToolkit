using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.Update;
internal sealed class UpdateProfileEntryCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : ICommandHandler<UpdateProfileEntryCommand>
{
    public async Task<Result> Handle(UpdateProfileEntryCommand command, CancellationToken cancellationToken)
    {
        ProfileEntry? profileEntry = await context.ProfileEntries
            .SingleOrDefaultAsync(pe => pe.Id == command.Id && pe.UserId == userContext.UserId, cancellationToken);

        if (profileEntry is null)
        {
            return Result.Failure(ProfileEntryErrors.NotFound(command.Id));
        }

        profileEntry.Title = command.Title;
        profileEntry.Organization = command.Organization;
        profileEntry.Location = command.Location;
        profileEntry.StartDate = command.StartDate;
        profileEntry.EndDate = command.EndDate;
        profileEntry.IsCurrent = command.IsCurrent;
        profileEntry.Description = command.Description;
        profileEntry.Category = command.Category;             

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
