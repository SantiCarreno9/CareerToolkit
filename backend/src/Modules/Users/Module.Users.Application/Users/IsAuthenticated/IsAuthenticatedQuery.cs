using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.IsAuthenticated;
public sealed record IsAuthenticatedQuery() : IQuery<IsAuthenticatedResponse>;
