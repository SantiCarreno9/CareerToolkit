using Module.Users.Application.Users.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.GetByEmail;

public sealed record GetUserByEmailQuery(string Email) : IQuery<UserResponse>;
