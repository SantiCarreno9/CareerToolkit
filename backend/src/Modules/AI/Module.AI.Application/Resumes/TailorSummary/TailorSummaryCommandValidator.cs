using FluentValidation;
using Module.AI.Domain.Entities;

namespace Module.AI.Application.Resumes.TailorSummary;
internal sealed class TailorSummaryCommandValidator : AbstractValidator<TailorSummaryCommand>
{
    public TailorSummaryCommandValidator()
    {
        RuleFor(x => x.CurrentSummary).NotEmpty().Unless(x => x.Instruction.AiInstructionType == AiInstruction.Generate);        
    }
}
