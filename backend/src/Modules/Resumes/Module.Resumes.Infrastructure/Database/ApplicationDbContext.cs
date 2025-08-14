using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Infrastructure.Database;

public class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<ProfileEntry> ProfileEntries { get; set; }
    public DbSet<Resume> Resumes { get; set; }
    public DbSet<CoverLetter> CoverLetters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        modelBuilder.HasDefaultSchema(Schemas.Default);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        int result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }
}
