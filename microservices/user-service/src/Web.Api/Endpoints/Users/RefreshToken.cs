using Application.Abstractions.Messaging;
using Application.Users.Login;
using Application.Users.LoginUserWithRefreshToken;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class RefreshToken : IEndpoint
{
    public sealed record Request(string RefreshToken);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.BasePath + "/refresh-token", async (
            bool? useCookies,
            [FromBody] Request? request,
            ICommandHandler<LoginUserWithRefreshTokenCommand, LoginUserResponse> handler,
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
