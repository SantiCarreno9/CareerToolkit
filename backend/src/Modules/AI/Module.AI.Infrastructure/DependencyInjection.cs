using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Module.AI.Application.Abstractions.AIService;
using Module.AI.Application.Abstractions.Authentication;
using Module.AI.Endpoints;
using Module.AI.Infrastructure;
using Module.AI.Infrastructure.Authentication;
using Module.AI.Infrastructure.Services.Gemini;
using SharedKernel.Endpoints;

namespace Module.AI.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddAIInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) =>
        services
            .AddServices()
            .AddHealthChecks(configuration)
            .AddAuthenticationInternal()
            .AddAuthorizationInternal()
            .AddAIModuleEndpoints();

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddHttpClient();
        services.AddScoped<IAIService, GeminiService>();

        return services;
    }

    private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHealthChecks();

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

    private static IServiceCollection AddAIModuleEndpoints(this IServiceCollection services)
    {
        services.AddEndpoints(AssemblyReference.AIModuleAssembly);
        return services;
    }

}
