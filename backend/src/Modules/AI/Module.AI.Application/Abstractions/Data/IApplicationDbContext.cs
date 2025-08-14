using Microsoft.EntityFrameworkCore;
using Module.AI.Domain.Entities;

namespace Module.AI.Application.Abstractions.Data;
public interface IApplicationDbContext
{
    DbSet<ExperienceEntry> ProfileEntries { get; }            

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
