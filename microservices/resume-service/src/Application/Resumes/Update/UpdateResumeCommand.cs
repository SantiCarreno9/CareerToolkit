using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain.Entities;

namespace Application.Resumes.Update;
public sealed record UpdateResumeCommand(
    string Id,    
    string Name,
    string UserInfo,
    List<ProfileEntry> ProfileEntries,
    string Keywords,
    string? JobPosting,
    string ResumeInfo) : ICommand<ResumeResponse>;
