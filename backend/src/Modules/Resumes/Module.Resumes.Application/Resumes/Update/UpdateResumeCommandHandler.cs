using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.Extensions;
using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Update;
internal sealed class UpdateResumeCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<UpdateResumeCommand, ResumeResponse>
{
    public async Task<Result<ResumeResponse>> Handle(UpdateResumeCommand command, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.Unauthorized());
        }
        Resume? resume = await context.Resumes
            .SingleOrDefaultAsync(pe => pe.Id == command.Id && pe.UserId == userContext.UserId, cancellationToken);

        if (resume is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.NotFound(command.Id));
        }

        resume.Name = command.Name;
        resume.UserInfo = command.UserInfo;
        resume.ProfileEntries = command.ProfileEntries;
        resume.ResumeInfo = command.ResumeInfo;
        resume.Keywords = command.Keywords;
        resume.JobPosting = command.JobPosting;
        resume.ModifiedAt = dateTimeProvider.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new ResumeResponse(
            resume.Id,
            resume.Name,
            resume.UserInfo,
            resume.ProfileEntries.ToResponse(),
            resume.ResumeInfo,
            resume.Keywords,
            resume.JobPosting,
            resume.CreatedAt,
            resume.ModifiedAt
            );
    }
}
