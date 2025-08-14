using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.Register;

public sealed record RegisterUserCommand(string Email, string FullName, string Password)
    : ICommand;
