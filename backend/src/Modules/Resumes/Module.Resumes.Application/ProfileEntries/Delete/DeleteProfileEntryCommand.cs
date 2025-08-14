using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Delete;
public sealed record DeleteProfileEntryCommand(string EntryId) : ICommand;
