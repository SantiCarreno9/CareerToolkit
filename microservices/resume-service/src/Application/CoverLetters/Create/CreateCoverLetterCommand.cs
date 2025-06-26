using Application.Abstractions.Messaging;
using Application.CoverLetters.Shared;
using Application.Resumes.Shared;
using Domain.Entities;

namespace Application.CoverLetters.Create;
public sealed record CreateCoverLetterCommand(    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting) : ICommand<CoverLetterResponse>;
