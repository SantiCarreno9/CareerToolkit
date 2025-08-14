using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Application.ProfileEntries.Shared;
public class BaseProfileEntryCommand
{    
    public string Title { get; set; }
    public string? Organization { get; set; }
    public string? Location { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public ProfileEntryCategory Category { get; set; }
}
