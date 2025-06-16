using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Extensions;
using Application.Resumes.Shared;
using Application.Resumes.Update;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.ProfileEntries.Update;
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
        resume.ModifiedAt = dateTimeProvider.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new ResumeResponse(
            resume.Id,
            resume.Name,
            resume.UserInfo,
            resume.ProfileEntries.ToResponse(),
            resume.ResumeInfo,
            resume.Keywords,
            resume.CreatedAt,
            resume.ModifiedAt
            );
    }
}
