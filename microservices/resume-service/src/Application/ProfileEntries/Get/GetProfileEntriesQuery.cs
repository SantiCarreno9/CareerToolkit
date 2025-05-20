using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;

namespace Application.ProfileEntries.Get;
public sealed record GetProfileEntriesQuery() : IQuery<List<ProfileEntryResponse>>;
