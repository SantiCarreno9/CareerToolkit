using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.Extensions;
using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Create;
internal sealed class CreateResumeCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<CreateResumeCommand, ResumeResponse>
{
    public async Task<Result<ResumeResponse>> Handle(CreateResumeCommand command, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<ResumeResponse>(ResumeErrors.Unauthorized());
        }
        var resume = new Resume
        {
            UserId = userContext.UserId,
            Name = command.Name,
            UserInfo = command.UserInfo,
            ProfileEntries = command.ProfileEntries,
            ResumeInfo = command.ResumeInfo,
            Keywords = command.Keywords,
            JobPosting = command.JobPosting,
            CreatedAt = dateTimeProvider.UtcNow,
            ModifiedAt = dateTimeProvider.UtcNow
        };

        context.Resumes.Add(resume);

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
            resume.ModifiedAt);
    }
}
