using FluentValidation;

namespace Application.CoverLetters.Create;
internal sealed class CreateCoverLetterCommandValidator : AbstractValidator<CreateCoverLetterCommand>
{
    public CreateCoverLetterCommandValidator()
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
