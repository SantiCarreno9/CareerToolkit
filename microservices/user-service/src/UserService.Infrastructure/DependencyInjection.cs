using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UserService.Application.Interfaces;
using UserService.Infrastructure.Data;
using UserService.Infrastructure.Repositories;

namespace UserService.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<AppDbContext>(option =>
                option.UseSqlite(configuration.GetConnectionString("SqliteConnection") ??
                    throw new InvalidOperationException("Connection string not found")));
            
            services.AddScoped<IUserRepository, UserRepository>();
            return services;
        }
    }
}
