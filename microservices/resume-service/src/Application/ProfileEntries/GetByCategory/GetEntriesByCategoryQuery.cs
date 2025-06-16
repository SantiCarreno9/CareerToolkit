using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;
using Domain.Entities;

namespace Application.ProfileEntries.GetByCategory;

public sealed record GetEntriesByCategoryQuery(ProfileEntryCategory Category) : IQuery<List<ProfileEntryResponse>>;
