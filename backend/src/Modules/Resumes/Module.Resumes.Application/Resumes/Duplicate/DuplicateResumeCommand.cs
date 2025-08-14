using Module.Resumes.Application.Resumes.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Duplicate;
public sealed record DuplicateResumeCommand(
    string Id,
    string Name,
    string Keywords,
    string? JobPosting) : ICommand<ResumeResponse>;
