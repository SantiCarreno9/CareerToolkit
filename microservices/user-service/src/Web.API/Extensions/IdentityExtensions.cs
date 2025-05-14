using Infrastructure.Users;
using Web.Api.Endpoints;
using Web.Api.Endpoints.Users;

namespace Web.Api.Extensions;

public static class IdentityExtensions
{
    public static IApplicationBuilder UseDotNetIdentity(
        this WebApplication app
        )
    {
        app.MapCustomIdentityApi<UserDb>();

        return app;
    }
}
