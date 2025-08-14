using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Domain.Entities;
using Module.Resumes.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Delete;
internal sealed class DeleteResumeCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext) 
    : ICommandHandler<DeleteResumeCommand>
{
    public async Task<Result> Handle(DeleteResumeCommand command, CancellationToken cancellationToken)
    {
        if (userContext.UserId is null)
        {
            return Result.Failure(ResumeErrors.Unauthorized());
        }
        Resume? resume = context.Resumes
            .SingleOrDefault(pe => pe.Id == command.Id && pe.UserId == userContext.UserId);

        if (resume is null)
        {
            return Result.Failure(ResumeErrors.NotFound(command.Id));
        }
        context.Resumes.Remove(resume);
        await context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
