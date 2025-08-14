using SharedKernel;

namespace Module.Resumes.Domain.Events;
public sealed record UserInfoUpdatedDomainEvent(string UserId) : IDomainEvent;
