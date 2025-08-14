using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.Extensions;
using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.GetById;

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
