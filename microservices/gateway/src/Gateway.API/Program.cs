using Gateway.API.Extensions;

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

var app = builder.Build();

app.MapGet("/api/test", () =>
{
    return "Hello World";
});

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapReverseProxy(proxyPipeline => proxyPipeline.AddAutheticationHeaders());

app.Run();