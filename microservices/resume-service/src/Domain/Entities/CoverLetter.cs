using SharedKernel;

namespace Domain.Entities;
public class CoverLetter : Entity
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string UserId { get; set; }
    public DateOnly Date { get; set; }
    public string Content { get; set; }
    public string Keywords { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
}
