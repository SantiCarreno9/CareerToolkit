using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Application.Abstractions.Behaviors;
using SharedKernel.Application.Abstractions.Messaging;

namespace SharedKernel.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, Type type)
    {
        // Register custom IQueryHandler and ICommandHandler
        services.Scan(scan => scan
            .FromAssembliesOf(type)
            .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), publicOnly: false)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        services.Scan(scan => scan
            .FromAssembliesOf(type)
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), publicOnly: false)
                .AsImplementedInterfaces()
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), publicOnly: false)
                .AsImplementedInterfaces()
            .WithScopedLifetime());        

        services.Scan(scan => scan
            .FromAssembliesOf(type)
            .AddClasses(classes => classes.AssignableTo(typeof(IDomainEventHandler<>)), publicOnly: false)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        services.AddValidatorsFromAssembly(type.Assembly, includeInternalTypes: true);

        return services;
    }

    public static IServiceCollection AddApplicationDecorators(this IServiceCollection services)
    {
        services.TryDecorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));
        services.TryDecorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));

        services.TryDecorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));
        services.TryDecorate(typeof(ICommandHandler<,>), typeof(LoggingDecorator.CommandHandler<,>));
        services.TryDecorate(typeof(ICommandHandler<>), typeof(LoggingDecorator.CommandBaseHandler<>));

        return services;
    }

    //public static IServiceCollection AddApplication(this IServiceCollection services, Assembly assembly)
    //{
    //    //services.Scan(scan => scan
    //    //        .FromAssemblies(AppDomain.CurrentDomain.GetAssemblies())
    //    //        .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>))
    //    //                                    .Where(t => t.Name.Contains("Decorator")), publicOnly: false)
    //    //        .AsImplementedInterfaces()
    //    //        .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>))
    //    //                                    .Where(t => t.Name.Contains("Decorator")), publicOnly: false)
    //    //        .AsImplementedInterfaces()
    //    //        .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>))
    //    //                                    .Where(t => t.Name.Contains("Decorator")), publicOnly: false)
    //    //        .AsImplementedInterfaces()
    //    //        .WithScopedLifetime());

    //    //// Command decorators
    //    //services.TryDecorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));
    //    //services.TryDecorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));
    //    //services.TryDecorate(typeof(ICommandHandler<,>), typeof(LoggingDecorator.CommandHandler<,>));
    //    //services.TryDecorate(typeof(ICommandHandler<>), typeof(LoggingDecorator.CommandBaseHandler<>));

    //    //// Query decorators
    //    //services.TryDecorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));

    //    // Register custom IQueryHandler and ICommandHandler        
    //    services.Scan(scan => scan
    //        .FromAssemblyOf(typeof(assembly))
    //        .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), publicOnly: false)
    //        .AsImplementedInterfaces()
    //        .WithScopedLifetime());

    //    services.Scan(scan => scan
    //        .FromAssemblies(assemblies)
    //        .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), publicOnly: false)
    //            .AsImplementedInterfaces()
    //        .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), publicOnly: false)
    //            .AsImplementedInterfaces()
    //        .WithScopedLifetime());

    //    services.TryDecorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));
    //    services.TryDecorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));

    //    services.TryDecorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));
    //    services.TryDecorate(typeof(ICommandHandler<,>), typeof(LoggingDecorator.CommandHandler<,>));
    //    services.TryDecorate(typeof(ICommandHandler<>), typeof(LoggingDecorator.CommandBaseHandler<>));

    //    services.Scan(scan => scan
    //        .FromAssemblies(assemblies)
    //        .AddClasses(classes => classes.AssignableTo(typeof(IDomainEventHandler<>)), publicOnly: false)
    //        .AsImplementedInterfaces()
    //        .WithScopedLifetime());

    //    services.AddValidatorsFromAssemblies(assemblies, includeInternalTypes: true);

    //    return services;
    //}
}
