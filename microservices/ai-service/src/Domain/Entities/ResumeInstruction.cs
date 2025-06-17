namespace Domain.Entities;
public class ResumeInstruction
{
    public string JobPosting { get; set; }
    public string Instruction { get; set; }
    public AiInstruction AiInstructionType { get; set; }
}
