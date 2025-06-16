using Application.Abstractions.Messaging;
using Application.Users.Shared;

namespace Application.Users.GetByEmail;

public sealed record GetUserByEmailQuery(string Email) : IQuery<UserResponse>;
