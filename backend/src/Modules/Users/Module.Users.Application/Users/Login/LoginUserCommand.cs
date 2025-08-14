using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.Login;

public sealed record LoginUserCommand(string Email, string Password) : ICommand<LoginUserResponse>;
