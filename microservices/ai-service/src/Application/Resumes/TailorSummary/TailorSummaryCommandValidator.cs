using Domain.Entities;
using FluentValidation;

namespace Application.Resumes.TailorExperienceEntry;
internal sealed class TailorSummaryCommandValidator : AbstractValidator<TailorSummaryCommand>
{
    public TailorSummaryCommandValidator()
    {
        RuleFor(x => x.CurrentSummary).NotEmpty().Unless(x => x.Instruction.AiInstructionType == AiInstruction.Generate);        
    }
}
