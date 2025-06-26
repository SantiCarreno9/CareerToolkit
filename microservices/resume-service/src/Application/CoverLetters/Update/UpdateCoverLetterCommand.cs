using Application.Abstractions.Messaging;
using Application.CoverLetters.Shared;
using Domain.Entities;

namespace Application.CoverLetters.Update;
public sealed record UpdateCoverLetterCommand(
    string Id,    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string Keywords,
    string? JobPosting,
    string ResumeInfo) : ICommand<CoverLetterResponse>;
