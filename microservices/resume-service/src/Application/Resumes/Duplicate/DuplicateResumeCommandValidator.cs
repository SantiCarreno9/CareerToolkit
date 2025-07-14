using FluentValidation;

namespace Application.Resumes.Duplicate;
internal sealed class DuplicateResumeCommandValidator : AbstractValidator<DuplicateResumeCommand>
{
    public DuplicateResumeCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Resume is required.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.");
    }
}
