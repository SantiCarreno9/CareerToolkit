using FluentValidation;
using Module.AI.Domain.Entities;

namespace Module.AI.Application.Resumes.TailorSkills;
internal sealed class TailorSkillsCommandValidator : AbstractValidator<TailorSkillsCommand>
{
    public TailorSkillsCommandValidator()
    {
        RuleFor(x => x.CurrentSkills).NotEmpty().Unless(x => x.Instruction.AiInstructionType == AiInstruction.Generate);        
    }
}
