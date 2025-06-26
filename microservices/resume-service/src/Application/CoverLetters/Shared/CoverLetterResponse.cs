using Application.ProfileEntries.Shared;
using Domain.Entities;

namespace Application.CoverLetters.Shared;
public sealed record CoverLetterResponse(
    string Id,
    string Name,
    DateOnly Date,    
    string Content,
    string Keywords,
    //string? JobPosting,
    DateTime CreatedAt,
    DateTime ModifiedAt);
