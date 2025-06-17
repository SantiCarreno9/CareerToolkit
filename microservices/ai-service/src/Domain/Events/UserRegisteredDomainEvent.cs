using SharedKernel;

namespace Domain.Events;

public sealed record UserRegisteredDomainEvent(string UserId) : IDomainEvent;
