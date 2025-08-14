using Module.Resumes.Application.ProfileEntries.Shared;

namespace Module.Resumes.Application.Resumes.Shared;
public sealed record ResumeResponse(
    string Id,
    string Name,
    string UserInfo,
    List<ProfileEntryResponse> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting,
    DateTime CreatedAt,
    DateTime ModifiedAt);
