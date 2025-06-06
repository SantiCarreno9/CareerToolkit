using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.GetByCategory;

internal sealed class GetEntriesByCategoryQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : IQueryHandler<GetEntriesByCategoryQuery, List<ProfileEntryResponse>>
{
    public async Task<Result<List<ProfileEntryResponse>>> Handle(GetEntriesByCategoryQuery query, CancellationToken cancellationToken)
    {
        List<ProfileEntryResponse>? profileEntries = await context.ProfileEntries
            .Where(pe => pe.Category == query.Category && pe.UserId == userContext.UserId)
            .Select(pe => new ProfileEntryResponse
            {
                Id = pe.Id,                
                Title = pe.Title,
                Organization = pe.Organization,
                Location = pe.Location,
                StartDate = pe.StartDate,
                EndDate = pe.EndDate,
                IsCurrent = pe.IsCurrent,
                Description = pe.Description,
                Category = pe.Category
            })
            .OrderByDescending(pe => pe.StartDate)
            .ToListAsync(cancellationToken);        

        return profileEntries;
    }
}
