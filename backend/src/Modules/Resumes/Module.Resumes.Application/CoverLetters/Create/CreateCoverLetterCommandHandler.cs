using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Application.CoverLetters.Shared;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.Create;
internal sealed class CreateCoverLetterCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<CreateCoverLetterCommand, CoverLetterResponse>
{
    public async Task<Result<CoverLetterResponse>> Handle(CreateCoverLetterCommand command, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure<CoverLetterResponse>(CoverLetterErrors.Unauthorized());
        }
        var coverLetter = new CoverLetter();
        //var resume = new CoverLetter
        //{
        //    UserId = userContext.UserId,
        //    Name = command.Name,
        //    UserInfo = command.UserInfo,
        //    ProfileEntries = command.ProfileEntries,
        //    ResumeInfo = command.ResumeInfo,
        //    Keywords = command.Keywords,
        //    JobPosting = command.JobPosting,
        //    CreatedAt = dateTimeProvider.UtcNow,
        //    ModifiedAt = dateTimeProvider.UtcNow
        //};

        //context.Resumes.Add(resume);

        //await context.SaveChangesAsync(cancellationToken);

        //return new ResumeResponse(
        //    resume.Id,
        //    resume.Name,
        //    resume.UserInfo,
        //    resume.ProfileEntries.ToResponse(),
        //    resume.ResumeInfo,
        //    resume.Keywords,
        //    resume.JobPosting,
        //    resume.CreatedAt,
        //    resume.ModifiedAt);
        return new CoverLetterResponse(
            coverLetter.Id,
            coverLetter.Name,
            coverLetter.Date,
            coverLetter.Content,
            coverLetter.Keywords,
            coverLetter.CreatedAt,
            coverLetter.ModifiedAt
            );
    }
}
