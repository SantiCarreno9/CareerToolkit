using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Create;
public sealed record CreateResumeCommand(    
    string Name,
    string UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting) : ICommand<ResumeResponse>;
