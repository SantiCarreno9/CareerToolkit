using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
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
        IQueryable<ResumeResponse> resumes = context.Resumes
            .Where(r => r.UserId == userContext.UserId)
            .Select(r => new ResumeResponse
            (
                r.Id,
                r.Name,
                r.UserInfo,
                r.ProfileEntries,
                r.ResumeInfo,
                r.Keywords,
                r.CreatedAt,
                r.ModifiedAt
            ))
            .OrderByDescending(pe => pe.CreatedAt);

        return await PagedList<ResumeResponse>.CreateAsync(resumes, query.Page, query.PageSize);
    }
}
