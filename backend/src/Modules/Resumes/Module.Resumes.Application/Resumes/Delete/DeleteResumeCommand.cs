using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Delete;
public sealed record DeleteResumeCommand(string Id) : ICommand;
