using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.ProfileEntries.Shared;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Get;

internal sealed class GetProfileEntriesQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : IQueryHandler<GetProfileEntriesQuery, List<ProfileEntryResponse>>
{
    public async Task<Result<List<ProfileEntryResponse>>> Handle(GetProfileEntriesQuery query, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<List<ProfileEntryResponse>>(ProfileEntryErrors.Unauthorized());
        }

        List<ProfileEntryResponse>? profileEntry = await context.ProfileEntries
            .Where(pe => pe.UserId == userContext.UserId)
            .OrderByDescending(pe => pe.StartDate)
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
            .ToListAsync(cancellationToken);

        return profileEntry;
    }
}
