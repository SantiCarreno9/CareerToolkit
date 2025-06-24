using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain.Entities;

namespace Application.Resumes.Create;
public sealed record CreateResumeCommand(    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting) : ICommand<ResumeResponse>;
