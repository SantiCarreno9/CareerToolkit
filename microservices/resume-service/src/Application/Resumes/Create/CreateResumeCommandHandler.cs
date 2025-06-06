using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain.Entities;
using Domain.Errors;
using SharedKernel;

namespace Application.Resumes.Create;
internal sealed class CreateResumeCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext)
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
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };

        context.Resumes.Add(resume);

        await context.SaveChangesAsync(cancellationToken);

        return new ResumeResponse(
            resume.Id,
            resume.Name,
            resume.UserInfo,
            resume.ProfileEntries,
            resume.ResumeInfo,
            resume.Keywords,
            resume.CreatedAt,
            resume.ModifiedAt);
    }
}
