using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Update;
internal sealed class UpdateProfileEntryCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : ICommandHandler<UpdateProfileEntryCommand>
{
    public async Task<Result> Handle(UpdateProfileEntryCommand command, CancellationToken cancellationToken)
    {
        if(userContext.UserId is null)
        {
            return Result.Failure(ProfileEntryErrors.Unauthorized());
        }
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
