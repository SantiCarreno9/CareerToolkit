using Domain.Entities;

namespace Application.ProfileEntries.Shared;

public sealed record ProfileEntryResponse
{
    public string Id { get; set; }    
    public ProfileEntryCategory Category { get; set; }
    public string Title { get; set; }
    public string? Organization { get; set; }
    public string? Location { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
}
