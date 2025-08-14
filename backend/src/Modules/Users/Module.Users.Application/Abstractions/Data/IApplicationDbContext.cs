using Microsoft.EntityFrameworkCore;
using Module.Users.Domain.Entities;

namespace Module.Users.Application.Abstractions.Data;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }    
    DbSet<RefreshToken> RefreshTokens { get; }    

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
