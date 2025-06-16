using Application.Abstractions.Messaging;
using SharedKernel;

namespace Application.Resumes.Delete;
public sealed record DeleteResumeCommand(string Id) : ICommand;
