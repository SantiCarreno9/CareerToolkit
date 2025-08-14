using Module.Resumes.Application.CoverLetters.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.Create;
public sealed record CreateCoverLetterCommand(    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting) : ICommand<CoverLetterResponse>;
