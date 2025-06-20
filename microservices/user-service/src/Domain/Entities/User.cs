﻿using SharedKernel;

namespace Domain.Entities;

public class User : Entity
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string PasswordHash { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public Dictionary<string, string> AdditionalContactInfo { get; set; } = [];
}
