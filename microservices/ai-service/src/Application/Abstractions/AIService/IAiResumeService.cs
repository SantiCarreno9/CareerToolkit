using Domain.Entities;
using SharedKernel;

namespace Application.Abstractions.AIService;
public interface IAiResumeService
{
    Task<List<string>> TailorExperienceEntry(ResumeInstruction instruction, ExperienceEntry experienceEntry);
    Task<List<string>> TailorSummary(ResumeInstruction instruction, List<ExperienceEntry> experienceEntries, string? summary);
    Task<List<string>> TailorSection(ResumeInstruction instruction, string SectionContent);
    Task<Result<List<string>>> SelectExperienceEntries(ResumeInstruction instruction, List<ExperienceEntry> experienceEntries);
}
