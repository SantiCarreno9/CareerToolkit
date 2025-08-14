using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Application;

namespace Module.AI.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddAIModuleApplication(this IServiceCollection services)
    {        
        return services.AddApplication(typeof(DependencyInjection));
    }    
}
