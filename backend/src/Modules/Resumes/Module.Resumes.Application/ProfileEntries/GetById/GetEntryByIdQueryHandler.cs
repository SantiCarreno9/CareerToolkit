using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.ProfileEntries.Shared;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.GetById;

internal sealed class GetEntryByIdQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : IQueryHandler<GetEntryByIdQuery, ProfileEntryResponse>
{
    public async Task<Result<ProfileEntryResponse>> Handle(GetEntryByIdQuery query, CancellationToken cancellationToken)
    {
        ProfileEntryResponse? profileEntry = await context.ProfileEntries
            .Where(pe => pe.Id == query.entryId && pe.UserId == userContext.UserId)
            .Select(pe => new ProfileEntryResponse(
                pe.Id,
                pe.Category,
                pe.Title,
                pe.Organization,
                pe.Location,
                pe.StartDate,
                pe.EndDate,
                pe.IsCurrent,
                pe.Description
            ))
            .SingleOrDefaultAsync(cancellationToken);

        if (profileEntry is null)
        {
            return Result.Failure<ProfileEntryResponse>(ProfileEntryErrors.NotFound(query.entryId));
        }

        return profileEntry;
    }
}
