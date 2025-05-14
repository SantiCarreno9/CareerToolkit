using Application.Abstractions.Messaging;
using Application.Users.Shared;

namespace Application.Users.GetById;

public sealed record GetUserByIdQuery(string UserId) : IQuery<UserResponse>;
