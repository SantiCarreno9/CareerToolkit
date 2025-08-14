namespace Module.Resumes.Application.CoverLetters.Shared;
public sealed record CoverLetterResponse(
    string Id,
    string Name,
    DateOnly Date,    
    string Content,
    string Keywords,
    //string? JobPosting,
    DateTime CreatedAt,
    DateTime ModifiedAt);
