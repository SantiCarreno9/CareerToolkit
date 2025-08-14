using FluentValidation;

namespace Module.AI.Application.Resumes.TailorSection;
internal sealed class TailorSectionCommandValidator : AbstractValidator<TailorSectionCommand>
{
    public TailorSectionCommandValidator()
    {
        RuleFor(x => x.Instruction.Instruction).NotEmpty();        
    }
}
