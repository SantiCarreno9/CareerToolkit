using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Behaviors;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Get;
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
        IQueryable<GetResumesResponse?> resumes = !string.IsNullOrEmpty(query.SearchTerm) || !string.IsNullOrWhiteSpace(query.SearchTerm)
            ? await resumeDbOperations.FullTextSearch(context.Resumes
            .Where(r => r.UserId == userContext.UserId), query.SearchTerm)
            : context.Resumes
            .Where(r => r.UserId == userContext.UserId)
            .OrderByDescending(pe => pe.CreatedAt)
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
