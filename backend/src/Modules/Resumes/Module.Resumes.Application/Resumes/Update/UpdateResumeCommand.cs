using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Update;
public sealed record UpdateResumeCommand(
    string Id,    
    string Name,
    string UserInfo,
    List<ProfileEntry> ProfileEntries,
    string Keywords,
    string? JobPosting,
    string ResumeInfo) : ICommand<ResumeResponse>;
