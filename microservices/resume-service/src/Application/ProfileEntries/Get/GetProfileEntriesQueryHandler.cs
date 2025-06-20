﻿using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.Get;

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
