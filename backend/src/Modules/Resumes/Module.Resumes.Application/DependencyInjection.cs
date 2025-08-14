using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Application;

namespace Module.Resumes.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddResumeModuleApplication(this IServiceCollection services)
    {        
        return services.AddApplication(typeof(DependencyInjection));
    }    
}
