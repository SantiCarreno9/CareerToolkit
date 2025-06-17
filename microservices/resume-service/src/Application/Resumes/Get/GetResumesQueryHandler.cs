using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Extensions;
using Application.Resumes.Shared;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Resumes.Get;
internal sealed class GetResumesQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext)
    : IQueryHandler<GetResumesQuery, PagedList<ResumeResponse>>
{
    public async Task<Result<PagedList<ResumeResponse>>> Handle(GetResumesQuery query, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<PagedList<ResumeResponse>>(ResumeErrors.Unauthorized());
        }
        IQueryable<ResumeResponse?> resumes = context.Resumes
            .Where(r => r.UserId == userContext.UserId)
            .OrderByDescending(pe => pe.CreatedAt)
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
            ));

        if(!await resumes.AnyAsync(cancellationToken))
        {
            return new PagedList<ResumeResponse>(new List<ResumeResponse>(), 0, query.Page, query.PageSize);
        }

        return await PagedList<ResumeResponse>.CreateAsync(resumes, query.Page, query.PageSize);
    }
}
