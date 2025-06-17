using FluentValidation;

namespace Application.Resumes.TailorSection;
internal sealed class TailorSectionCommandValidator : AbstractValidator<TailorSectionCommand>
{
    public TailorSectionCommandValidator()
    {
        //RuleFor(x => x.Name)
        //    .NotEmpty()
        //    .WithMessage("Name is required.");
        //RuleFor(x => x.UserInfo)
        //    .NotNull()
        //    .WithMessage("UserInfo is required.");
        //RuleFor(x => x.ProfileEntries)
        //    .NotEmpty()
        //    .WithMessage("At least one profile entry is required.");
    }
}
