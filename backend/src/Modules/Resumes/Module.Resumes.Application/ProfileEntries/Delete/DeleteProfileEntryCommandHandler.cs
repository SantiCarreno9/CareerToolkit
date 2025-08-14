using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Delete;
internal sealed class DeleteProfileEntryCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : ICommandHandler<DeleteProfileEntryCommand>
{
    public async Task<Result> Handle(DeleteProfileEntryCommand command, CancellationToken cancellationToken)
    {
        ProfileEntry? profileEntry = await context.ProfileEntries
            .SingleOrDefaultAsync(pe => pe.Id == command.EntryId && pe.UserId == userContext.UserId, cancellationToken);

        if (profileEntry is null)
        {
            return Result.Failure(ProfileEntryErrors.NotFound(command.EntryId));
        }

        context.ProfileEntries.Remove(profileEntry);

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
