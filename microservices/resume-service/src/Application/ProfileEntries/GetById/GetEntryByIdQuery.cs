using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;

namespace Application.ProfileEntries.GetById;

public sealed record GetEntryByIdQuery(string entryId) : IQuery<ProfileEntryResponse>;
