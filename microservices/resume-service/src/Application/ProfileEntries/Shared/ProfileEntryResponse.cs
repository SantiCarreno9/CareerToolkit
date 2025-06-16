using Domain.Entities;

namespace Application.ProfileEntries.Shared;

public sealed record ProfileEntryResponse(
    string Id,
    ProfileEntryCategory Category,
    string Title,
    string? Organization,
    string? Location,
    DateOnly StartDate,
    DateOnly? EndDate,
    bool IsCurrent,
    string? Description
);
