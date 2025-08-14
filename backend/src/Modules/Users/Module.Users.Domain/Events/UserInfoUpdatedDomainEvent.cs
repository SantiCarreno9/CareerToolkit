using SharedKernel;

namespace Module.Users.Domain.Events;
public sealed record UserInfoUpdatedDomainEvent(string UserId) : IDomainEvent;
