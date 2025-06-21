using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.Resumes.TailorSection;
internal sealed class TailorSectionCommandHandler(
    IAIService service)
    : ICommandHandler<TailorSectionCommand, string>
{
    public async Task<Result<string>> Handle(TailorSectionCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job: {command.Instruction.JobPosting}";
        prompt += $"\n{command.Instruction.Instruction}";
        
        string instruction = "You are an expert resume writer. Always use professional language. Provide clear, concise responses optimized for job applications.\r\n";
        return await service.GenerateText<string>(new InstructionToAi(prompt, instruction));
    }
}
