using Module.Resumes.Application.ProfileEntries.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.GetByCategory;

public sealed record GetEntriesByCategoryQuery(ProfileEntryCategory Category) : IQuery<List<ProfileEntryResponse>>;
