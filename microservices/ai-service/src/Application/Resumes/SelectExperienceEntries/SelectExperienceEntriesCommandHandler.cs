using Application.Abstractions.AIService;
using Application.Abstractions.Messaging;
using Domain.Entities;
using SharedKernel;

namespace Application.Resumes.SelectExperienceEntries;
internal sealed class SelectExperienceEntriesCommandHandler(
    IAIService service)
    : ICommandHandler<SelectExperienceEntriesCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(SelectExperienceEntriesCommand command, CancellationToken cancellationToken)
    {
        string prompt = $"I'm applying for the following job: {command.Instruction.JobPosting}\n";
        prompt += "Now, I will send you all of my experience entries, each one has its ID, Title/Position and tasks.";                
        foreach (ExperienceEntry item in command.ExperienceEntries)
        {
            prompt += $"\n ID: {item.Id} | Position: {item.Title} \nTasks: {item.Description}";
        }

        prompt += "\n Based on the job requirements, select the 5 most relevant experience entries and return **only** their IDs along with the reason why you picked them separated by a comma";
        prompt += "\n Please always try to highlight keywords relevant to the job.";
        if (!string.IsNullOrWhiteSpace(command.Instruction.Instruction))
        {
            prompt += $"\n\nAdditional instructions with higher priority:\n{command.Instruction.Instruction}";
        }
        string instruction = "You are an expert resume writer. Always use professional language. Provide clear, concise responses optimized for job applications.\r\n";
        return await service.GenerateText<List<string>>(new InstructionToAi(prompt, instruction));
    }
}
