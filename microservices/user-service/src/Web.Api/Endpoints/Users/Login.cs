﻿using Application.Abstractions.Messaging;
using Application.Users.Login;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class Login : IEndpoint
{
    public sealed record Request(string Email, string Password);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.BasePath + "/login", async (
            bool? useCookies,
            [FromBody] Request request,
            ICommandHandler<LoginUserCommand, LoginUserResponse> handler,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration,
            CancellationToken cancellationToken) =>
        {
            var command = new LoginUserCommand(request.Email, request.Password);

            Result<LoginUserResponse> result = await handler.Handle(command, cancellationToken);

            if (result.IsSuccess && useCookies.HasValue && useCookies.Value && httpContextAccessor.HttpContext is not null)
            {
                CookiesManagementExtension.SetTokensInsideCookies(result.Value, httpContextAccessor.HttpContext, configuration);
                return Results.Ok();
            }

            return result.Match(Results.Ok, CustomResults.Problem);

        })
            .Produces<LoginUserResponse>(StatusCodes.Status200OK)
            .WithTags(Tags.Users);
    }
}
