using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.Delete;
public sealed record DeleteCoverLetterCommand(string Id) : ICommand;
