using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Module.Resumes.Application.Abstractions.Authentication;
using Module.Resumes.Application.Abstractions.Behaviors;
using Module.Resumes.Application.Abstractions.Data;
using Module.Resumes.Endpoints;
using Module.Resumes.Infrastructure;
using Module.Resumes.Infrastructure.Authentication;
using Module.Resumes.Infrastructure.Database;
using SharedKernel.Endpoints;

namespace Module.Resumes.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddResumesInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) =>
        services
            .AddServices()
            .AddDatabase(configuration)
            .AddHealthChecks(configuration)
            .AddAuthenticationInternal()
            .AddAuthorizationInternal()
            .AddResumeModuleEndpoints();

    private static IServiceCollection AddServices(this IServiceCollection services)
    {        
        services.AddScoped<IResumeDbOperations, ResumeDbOperations>();
        services.AddScoped<ICoverLetterDbOperations, CoverLetterDbOperations>();
        return services;
    }

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("Database");

        services.AddDbContext<ApplicationDbContext>(
            options => options
                .UseNpgsql(connectionString, npgsqlOptions =>
                    npgsqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Default))
                .UseSnakeCaseNamingConvention());

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        return services;
    }

    private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHealthChecks();
            //.AddNpgSql(configuration.GetConnectionString("Database")!);

        return services;
    }

    private static IServiceCollection AddAuthenticationInternal(
        this IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
        services.AddHttpContextAccessor();
        services.AddScoped<IUserContext, UserContext>();

        return services;
    }

    private static IServiceCollection AddAuthorizationInternal(this IServiceCollection services)
    {
        services.AddAuthorization();

        return services;
    }

    private static IServiceCollection AddResumeModuleEndpoints(this IServiceCollection services)
    {
        services.AddEndpoints(AssemblyReference.ResumeModuleAssembly);
        return services;
    }

}
