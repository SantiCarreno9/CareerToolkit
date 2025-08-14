using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Application;

namespace Module.Users.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddUserModuleApplication(this IServiceCollection services)
    {        
        return services.AddApplication(typeof(DependencyInjection));
    }    
}
