﻿namespace Domain.Entities;
public class RefreshToken
{
    public string Id { get; set; }
    public string Token { get; set; }
    public string UserId { get; set; }
    public DateTime ExpiresOnUtc { get; set; }
    public User User { get; set; }
}
