using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Extensions;
using Application.Resumes.Shared;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Resumes.GetById;

internal sealed class GetResumeByIdQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : IQueryHandler<GetResumeByIdQuery, ResumeResponse>
{
    public async Task<Result<ResumeResponse>> Handle(GetResumeByIdQuery query, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.Unauthorized());
        }
        ResumeResponse? profileEntry = await context.Resumes
            .Where(r => r.Id == query.Id && r.UserId == userContext.UserId)
            .Select(r => new ResumeResponse
            (
                r.Id,
                r.Name,
                r.UserInfo,
                r.ProfileEntries.ToResponse(),
                r.ResumeInfo,
                r.Keywords,
                r.JobPosting,
                r.CreatedAt,
                r.ModifiedAt
            ))
            .SingleOrDefaultAsync(cancellationToken);

        if (profileEntry is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.NotFound(query.Id));
        }

        return profileEntry;
    }
}
