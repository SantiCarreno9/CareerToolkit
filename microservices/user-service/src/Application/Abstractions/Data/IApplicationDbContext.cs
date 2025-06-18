﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }    
    DbSet<RefreshToken> RefreshTokens { get; }    

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
