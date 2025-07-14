using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Extensions;
using Application.Resumes.Shared;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Resumes.Duplicate;
internal sealed class DuplicateResumeCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<DuplicateResumeCommand, ResumeResponse>
{
    public async Task<Result<ResumeResponse>> Handle(DuplicateResumeCommand command, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.Unauthorized());
        }

        Resume resume = await context.Resumes.AsNoTracking().FirstOrDefaultAsync(r => r.Id == command.Id, cancellationToken);
        if (resume == null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.NotFound(command.Id));
        }
        var newCopy = new Resume
        {
            UserId = userContext.UserId,
            Name = command.Name,
            UserInfo = resume.UserInfo,
            ProfileEntries = resume.ProfileEntries,
            ResumeInfo = resume.ResumeInfo,
            Keywords = command.Keywords,
            JobPosting = command.JobPosting,
            CreatedAt = dateTimeProvider.UtcNow,
            ModifiedAt = dateTimeProvider.UtcNow
        };

        context.Resumes.Add(newCopy);

        await context.SaveChangesAsync(cancellationToken);

        return new ResumeResponse(
            newCopy.Id,
            newCopy.Name,
            newCopy.UserInfo,
            newCopy.ProfileEntries.ToResponse(),
            newCopy.ResumeInfo,
            newCopy.Keywords,
            newCopy.JobPosting,
            newCopy.CreatedAt,
            newCopy.ModifiedAt);
    }
}
