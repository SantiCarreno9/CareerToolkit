using FluentValidation;

namespace Application.Resumes.Create;
internal sealed class CreateResumeCommandValidator : AbstractValidator<CreateResumeCommand>
{
    public CreateResumeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.");
        RuleFor(x => x.UserInfo)
            .NotNull()
            .WithMessage("UserInfo is required.");
        RuleFor(x => x.ProfileEntries)
            .NotEmpty()
            .WithMessage("At least one profile entry is required.");
    }
}
