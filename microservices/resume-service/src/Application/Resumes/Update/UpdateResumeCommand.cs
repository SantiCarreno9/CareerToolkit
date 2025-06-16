using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain.Entities;

namespace Application.Resumes.Update;
public sealed record UpdateResumeCommand(
    string Id,    
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    List<string> Keywords,
    string ResumeInfo) : ICommand<ResumeResponse>;
