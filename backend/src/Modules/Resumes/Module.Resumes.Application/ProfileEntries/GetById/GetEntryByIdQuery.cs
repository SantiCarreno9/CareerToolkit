using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.GetById;

public sealed record GetEntryByIdQuery(string entryId) : IQuery<ProfileEntryResponse>;
