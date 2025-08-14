using SharedKernel;

namespace Module.AI.Domain.Events;
public sealed record UserInfoUpdatedDomainEvent(string UserId) : IDomainEvent;
