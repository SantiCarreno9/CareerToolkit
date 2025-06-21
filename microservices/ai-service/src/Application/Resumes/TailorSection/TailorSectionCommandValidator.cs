using FluentValidation;

namespace Application.Resumes.TailorSection;
internal sealed class TailorSectionCommandValidator : AbstractValidator<TailorSectionCommand>
{
    public TailorSectionCommandValidator()
    {
        RuleFor(x => x.Instruction.Instruction).NotEmpty();        
    }
}
