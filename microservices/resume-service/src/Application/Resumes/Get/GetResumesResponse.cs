namespace Application.Resumes.Get;
public sealed record GetResumesResponse(
    string Id,
    string Name,    
    string Keywords,    
    DateTime CreatedAt,
    DateTime ModifiedAt);
