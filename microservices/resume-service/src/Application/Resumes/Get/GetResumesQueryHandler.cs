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
    : IQueryHandler<GetResumesQuery, List<ResumeResponse>>
{
    public async Task<Result<List<ResumeResponse>>> Handle(GetResumesQuery query, CancellationToken cancellationToken)
    {
        if(userContext.UserId is null)
        {
            return Result.Failure<List<ResumeResponse>>(ResumeErrors.Unauthorized());
        }
        List<ResumeResponse>? resumes = await context.Resumes
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
            .ToListAsync(cancellationToken);

        return resumes;
    }
}
