using SharedKernel;

namespace Module.AI.Domain.Events;

public sealed record UserRegisteredDomainEvent(string UserId) : IDomainEvent;
