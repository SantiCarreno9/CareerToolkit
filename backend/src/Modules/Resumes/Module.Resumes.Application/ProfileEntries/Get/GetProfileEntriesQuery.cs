using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Get;
public sealed record GetProfileEntriesQuery() : IQuery<List<ProfileEntryResponse>>;
