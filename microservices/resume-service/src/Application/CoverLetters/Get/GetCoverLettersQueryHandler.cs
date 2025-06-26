using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Behaviors;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.CoverLetters.Get;
internal sealed class GetCoverLettersQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    ICoverLetterDbOperations resumeDbOperations)
    : IQueryHandler<GetCoverLettersQuery, PagedList<GetCoverLettersResponse>>
{
    public async Task<Result<PagedList<GetCoverLettersResponse>>> Handle(GetCoverLettersQuery query, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<PagedList<GetCoverLettersResponse>>(ResumeErrors.Unauthorized());
        }

        IQueryable<GetCoverLettersResponse?> coverLetters = !string.IsNullOrEmpty(query.SearchTerm) || !string.IsNullOrWhiteSpace(query.SearchTerm)
            ? await resumeDbOperations.FullTextSearch(context.CoverLetters
            .Where(cl => cl.UserId == userContext.UserId), query.SearchTerm)
            : context.CoverLetters
            .Where(r => r.UserId == userContext.UserId)
            .OrderByDescending(pe => pe.ModifiedAt)
            .Select(r => new GetCoverLettersResponse
            (
                r.Id,
                r.Name,
                r.Keywords,
                r.CreatedAt,
                r.ModifiedAt
            ));

        if (!await coverLetters.AnyAsync(cancellationToken))
        {
            return new PagedList<GetCoverLettersResponse>([], 0, query.Page, query.PageSize);
        }

        return await PagedList<GetCoverLettersResponse>.CreateAsync(coverLetters, query.Page, query.PageSize);
    }
}
