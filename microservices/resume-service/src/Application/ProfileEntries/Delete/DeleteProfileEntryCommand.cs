using Application.Abstractions.Messaging;

namespace Application.ProfileEntries.Delete;
public sealed record DeleteProfileEntryCommand(string EntryId) : ICommand;
