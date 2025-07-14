using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain.Entities;

namespace Application.Resumes.Duplicate;
public sealed record DuplicateResumeCommand(
    string Id,
    string Name,
    string Keywords,
    string? JobPosting) : ICommand<ResumeResponse>;
