using Module.Users.Application.Users.Login;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.LoginUserWithRefreshToken;
public sealed record LoginUserWithRefreshTokenCommand(string RefreshToken) : ICommand<LoginUserResponse>;
