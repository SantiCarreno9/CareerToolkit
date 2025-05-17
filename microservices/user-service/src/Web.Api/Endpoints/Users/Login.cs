using Application.Abstractions.Messaging;
using Application.Users.GetById;
using Application.Users.Shared;
using Domain.Entities;
using Infrastructure.Users;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Endpoints.Users;

internal sealed class Login : IEndpoint
{
    public sealed record Request(string Email, string Password);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/users/login", async(
            [FromQuery]bool? useCookies,
            [FromQuery] bool? useSessionCookies,
            [FromBody] Request login,
            IServiceProvider sp) =>
        {
            SignInManager<UserDb> signInManager = sp.GetRequiredService<SignInManager<UserDb>>();
            bool useCookieScheme = useCookies == true || useSessionCookies == true;
            bool isPersistent = useCookies == true && useSessionCookies != true;
            signInManager.AuthenticationScheme = useCookieScheme ? IdentityConstants.ApplicationScheme : IdentityConstants.BearerScheme;

            var result = await signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                return Results.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
            }

            // The signInManager already produced the needed response in the form of a cookie or bearer token.
            return Results.Ok();
        })
            .WithTags(Tags.Users);

        //app.MapGet("api/users/login", async (
        //    string userId,
        //    IQueryHandler<GetUserByIdQuery, UserResponse> handler,
        //    CancellationToken cancellationToken) =>
        //{
        //    var query = new GetUserByIdQuery(userId);

        //    Result<UserResponse> result = await handler.Handle(query, cancellationToken);

        //    return result.Match(Results.Ok, CustomResults.Problem);
        //})
        //.HasPermission(Permissions.UsersAccess)
        //.WithTags(Tags.Users);
    }
}
