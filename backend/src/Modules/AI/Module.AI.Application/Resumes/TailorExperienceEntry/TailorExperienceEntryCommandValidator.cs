using FluentValidation;
using Module.AI.Domain.Entities;

namespace Module.AI.Application.Resumes.TailorExperienceEntry;
internal sealed class TailorExperienceEntryCommandValidator : AbstractValidator<TailorExperienceEntryCommand>
{
    public TailorExperienceEntryCommandValidator()
    {
        RuleFor(x => x.ExperienceEntry.Description)
            .NotEmpty()
            .Unless(x => x.Instruction.AiInstructionType == AiInstruction.Generate);

        RuleFor(x=>x.Instruction.Instruction).NotEmpty().When(x=>x.Instruction.AiInstructionType== AiInstruction.Custom);
    }
}
