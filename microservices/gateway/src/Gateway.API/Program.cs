using Gateway.API.Extensions;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthenticationProvider(builder.Configuration);

builder.Services.AddAuthorization();

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
        policy => policy
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins(builder.Configuration["FrontendUrl"]!)
                )
);

builder.Services.AddHttpContextAccessor();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("fixed-by-ip", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Request.Headers["X-Forwarded-For"].ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1)
            }));
});

var app = builder.Build();

app.MapGet("/api/test", () =>
{
    return "Hello World";
});

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapReverseProxy(proxyPipeline => proxyPipeline.AddAutheticationHeaders());

app.UseRateLimiter();

app.Run();