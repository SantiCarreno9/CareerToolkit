using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.CoverLetters.Delete;
public sealed record DeleteCoverLetterCommand(string Id) : ICommand;
