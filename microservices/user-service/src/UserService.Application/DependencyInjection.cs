using Microsoft.Extensions.DependencyInjection;
using UserService.Application.Interfaces;

namespace UserService.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService.Application.Services.UserService>();
            return services;
        }
    }
}
