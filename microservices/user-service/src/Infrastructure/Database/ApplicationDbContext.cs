using System.Reflection.Emit;
using Application.Abstractions.Data;
using Domain.Entities;
using Infrastructure.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace UserService.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<UserDb>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        builder.HasDefaultSchema("Identity");
    }
}
