using Backend;
using Backend.Extensions;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Module.AI.Application;
using Module.AI.Infrastructure;
using Module.Resumes.Application;
using Module.Resumes.Infrastructure;
using Module.Users.Application;
using Module.Users.Infrastructure;
using Serilog;
using SharedKernel.Application;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfig) => loggerConfig.ReadFrom.Configuration(context.Configuration));

builder.Services.AddSwaggerGenWithAuth();

builder.Services
    .AddUserModuleApplication()
    .AddResumeModuleApplication()
    .AddAIModuleApplication()
    //.AddApplicationDecorators()
    .AddPresentation()
    .AddBaseInfrastructure(builder.Configuration)
    .AddUsersInfrastructure(builder.Configuration)
    .AddResumesInfrastructure(builder.Configuration)
    .AddAIInfrastructure(builder.Configuration);

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
        policy => policy
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins(builder.Configuration["FrontendUrl"]!)
                )
);

WebApplication app = builder.Build();

app.MapEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerWithUI();

    app.ApplyMigrations();
}

app.MapHealthChecks("health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapGet("api/test", () => "Hello World");

app.UseCors("CorsPolicy");

app.UseRequestContextLogging();

app.UseSerilogRequestLogging();

app.UseExceptionHandler();

app.UseAuthenticationMiddleware();

await app.RunAsync();
