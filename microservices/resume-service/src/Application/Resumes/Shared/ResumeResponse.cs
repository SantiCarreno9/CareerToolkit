using Application.ProfileEntries.Shared;
using Domain.Entities;

namespace Application.Resumes.Shared;
public sealed record ResumeResponse(
    string Id,
    string Name,
    UserInfo UserInfo,
    List<ProfileEntryResponse> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting,
    DateTime CreatedAt,
    DateTime ModifiedAt);
