using Domain.Entities;
using FluentValidation;

namespace Application.Resumes.TailorSkills;
internal sealed class TailorSkillsCommandValidator : AbstractValidator<TailorSkillsCommand>
{
    public TailorSkillsCommandValidator()
    {
        RuleFor(x => x.CurrentSkills).NotEmpty().Unless(x => x.Instruction.AiInstructionType == AiInstruction.Generate);        
    }
}
