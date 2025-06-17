using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;
public interface IApplicationDbContext
{
    DbSet<ExperienceEntry> ProfileEntries { get; }            

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
