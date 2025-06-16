namespace Application.Users.Shared;

public sealed record UserResponse
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string FullName { get; init; }
    public string Address { get; init; }
    public string PhoneNumber { get; init; }
    public Dictionary<string, string> AdditionalContactInfo { get; init; } = [];
}
