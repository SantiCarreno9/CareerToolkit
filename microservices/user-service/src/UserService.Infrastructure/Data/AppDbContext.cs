using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {        
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
