using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Behaviors;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Resumes.Get;
internal sealed class GetResumesQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IResumeDbOperations resumeDbOperations)
    : IQueryHandler<GetResumesQuery, PagedList<GetResumesResponse>>
{
    public async Task<Result<PagedList<GetResumesResponse>>> Handle(GetResumesQuery query, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<PagedList<GetResumesResponse>>(ResumeErrors.Unauthorized());
        }
        //IQueryable<GetResumesResponse?> resumes = context.Resumes
        //    .Where(r => r.UserId == userContext.UserId)
        //    .OrderByDescending(pe => pe.ModifiedAt)
        //    .Select(r => new GetResumesResponse
        //    (
        //        r.Id,
        //        r.Name,                
        //        r.Keywords,                
        //        r.CreatedAt,
        //        r.ModifiedAt
        //    ));

        IQueryable<GetResumesResponse?> resumes = !string.IsNullOrEmpty(query.SearchTerm) || !string.IsNullOrWhiteSpace(query.SearchTerm)
            ? await resumeDbOperations.FullTextSearch(context.Resumes
            .Where(r => r.UserId == userContext.UserId), query.SearchTerm)
            : context.Resumes
            .Where(r => r.UserId == userContext.UserId)
            .OrderByDescending(pe => pe.ModifiedAt)
            .Select(r => new GetResumesResponse
            (
                r.Id,
                r.Name,
                r.Keywords,
                r.CreatedAt,
                r.ModifiedAt
            ));

        if (!await resumes.AnyAsync(cancellationToken))
        {
            return new PagedList<GetResumesResponse>([], 0, query.Page, query.PageSize);
        }

        return await PagedList<GetResumesResponse>.CreateAsync(resumes, query.Page, query.PageSize);
    }
}
