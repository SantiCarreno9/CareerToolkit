using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Module.Resumes.Infrastructure;
using SharedKernel;
using SharedKernel.Infrastructure.DomainEvents;
using SharedKernel.Infrastructure.Time;

namespace Module.Resumes.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddBaseInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) =>
        services
            .AddServices()
            .AddDatabase(configuration)
            .AddHealthChecks(configuration)
            .AddAuthenticationInternal()
            .AddAuthorizationInternal();

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        services.AddTransient<DomainEventsDispatcher>();        
        return services;
    }

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        //string? connectionString = configuration.GetConnectionString("Database");

        //services.AddDbContext<ApplicationDbContext>(
        //    options => options
        //        .UseNpgsql(connectionString, npgsqlOptions =>
        //            npgsqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Default))
        //        .UseSnakeCaseNamingConvention());

        //services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        return services;
    }

    private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        //services
        //    .AddHealthChecks()
        //    .AddNpgSql(configuration.GetConnectionString("Database")!);

        return services;
    }

    private static IServiceCollection AddAuthenticationInternal(
        this IServiceCollection services)
    {
        //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
        //services.AddHttpContextAccessor();
        //services.AddScoped<IUserContext, UserContext>();

        return services;
    }

    private static IServiceCollection AddAuthorizationInternal(this IServiceCollection services)
    {
        //services.AddAuthorization();

        return services;
    }

}
