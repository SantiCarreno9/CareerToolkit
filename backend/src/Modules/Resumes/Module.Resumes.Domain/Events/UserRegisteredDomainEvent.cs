using SharedKernel;

namespace Module.Resumes.Domain.Events;

public sealed record UserRegisteredDomainEvent(string UserId) : IDomainEvent;
