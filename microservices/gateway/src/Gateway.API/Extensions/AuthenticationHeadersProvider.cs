using System.Security.Claims;

namespace Gateway.API.Extensions
{
    public static class AuthenticationHeadersProvider
    {
        public static IReverseProxyApplicationBuilder AddAutheticationHeaders(
            this IReverseProxyApplicationBuilder proxyPipeline)
        {
            proxyPipeline.Use(async (context, next) =>
            {
                var isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
                var userId = string.Empty;
                if (isAuthenticated)
                {
                    userId = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
                }
                // Pass authentication state to microservices
                context.Request.Headers["x-user-authenticated"] = isAuthenticated.ToString();
                // Pass user ID to microservices 
                context.Request.Headers["x-user-id"] = userId;

                await next();
            });
            return proxyPipeline;
        }
    }
}
