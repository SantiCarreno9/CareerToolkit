using SharedKernel;

namespace Domain.Entities;
public class Resume : Entity
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public UserInfo UserInfo { get; set; }
    public List<ProfileEntry> ProfileEntries { get; set; }
    public string ResumeInfo { get; set; }
    public List<string> Keywords { get; set; }
    public string? JobPosting {  get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }

    public Resume()
    {
        Id = Guid.NewGuid().ToString();
    }
}
