using Module.Users.Application.Users.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.GetById;

public sealed record GetUserByIdQuery(string UserId) : IQuery<UserResponse>;
