using Module.Resumes.Application.CoverLetters.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.Update;
public sealed record UpdateCoverLetterCommand(
    string Id,    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string Keywords,
    string? JobPosting,
    string ResumeInfo) : ICommand<CoverLetterResponse>;
