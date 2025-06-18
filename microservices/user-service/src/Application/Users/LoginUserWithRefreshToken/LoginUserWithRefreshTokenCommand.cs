using Application.Abstractions.Messaging;
using Application.Users.Login;

namespace Application.Users.LoginUserWithRefreshToken;
public sealed record LoginUserWithRefreshTokenCommand(string RefreshToken):ICommand<LoginUserResponse>;
