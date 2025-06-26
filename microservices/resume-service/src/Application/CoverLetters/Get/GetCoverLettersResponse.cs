namespace Application.CoverLetters.Get;
public sealed record GetCoverLettersResponse(
    string Id,
    string Name,    
    string Keywords,    
    DateTime CreatedAt,
    DateTime ModifiedAt);
