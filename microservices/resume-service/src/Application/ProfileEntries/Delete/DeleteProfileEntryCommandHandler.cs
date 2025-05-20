using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.Delete;
internal sealed class DeleteProfileEntryCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : ICommandHandler<DeleteProfileEntryCommand>
{
    public async Task<Result> Handle(DeleteProfileEntryCommand command, CancellationToken cancellationToken)
    {
        ProfileEntry? profileEntry = await context.ProfileEntries
            .SingleOrDefaultAsync(pe => pe.Id == command.EntryId && pe.UserName == userContext.UserName, cancellationToken);

        if (profileEntry is null)
        {
            return Result.Failure(ProfileEntryErrors.NotFound(command.EntryId));
        }

        context.ProfileEntries.Remove(profileEntry);

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
