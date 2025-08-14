using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Module.Users.Application.Users.Login;
using Module.Users.Application.Users.LoginUserWithRefreshToken;
using Module.Users.Endpoints.Extensions;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Users.Endpoints.Endpoints.Users;

internal sealed class RefreshToken : IEndpoint
{
    public sealed record Request(string RefreshToken);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.UsersBasePath + "/refresh-token", async (
            bool? useCookies,
            [FromBody] Request? request,
            [FromServices] ICommandHandler<LoginUserWithRefreshTokenCommand, LoginUserResponse> handler,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration,
            CancellationToken cancellationToken) =>
        {
            string? refreshToken;
            httpContextAccessor.HttpContext!.Request.Cookies.TryGetValue("refreshToken", out string? cookieRefreshToken);
            refreshToken = request != null ? request.RefreshToken : cookieRefreshToken;

            if (refreshToken == null)
            {
                return Results.BadRequest("No refresh Token was provided");
            }

            var command = new LoginUserWithRefreshTokenCommand(refreshToken);

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
