using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;

namespace Web.Api.Extensions;

public static class AuthenticationMiddleware
{
    public static WebApplication UseAuthenticationMiddleware(
        this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            context.Request.Headers.TryGetValue("x-user-authenticated", out StringValues authenticated);
            bool isAuthenticated = bool.TryParse(authenticated, out bool result) && result;
            if (isAuthenticated)
            {
                var claims = new List<Claim>();
                if (context.Request.Headers.TryGetValue("x-user-id", out StringValues userIdValue))
                {
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, userIdValue.ToString()));
                }

                var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);
                context.User = principal;
            }
            await next();
        });
        app.UseAuthentication();
        app.UseAuthorization();
        return app;
    }
}
