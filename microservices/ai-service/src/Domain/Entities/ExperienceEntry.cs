using SharedKernel;

namespace Domain.Entities;

public class ExperienceEntry
{        
    public string Id { get; set; }
    public string Title { get; set; }
    public string? Organization { get; set; }    
    public string? Description { get; set; }
    
}
