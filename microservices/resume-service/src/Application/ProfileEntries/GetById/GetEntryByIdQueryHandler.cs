using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.GetById;

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
