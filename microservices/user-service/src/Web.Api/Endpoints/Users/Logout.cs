
namespace Web.Api.Endpoints.Users;

internal sealed class Logout : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.BasePath + "/logout", (
         IHttpContextAccessor httpContextAccessor) =>
        {
            HttpContext? httpContext = httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return Results.Problem();
            }

            if (httpContext.Request.Cookies.ContainsKey("accessToken"))
            {
                httpContext.Response.Cookies.Delete("accessToken");
                return Results.NoContent();
            }

            return Results.Unauthorized();
        })
            .Produces(StatusCodes.Status204NoContent)
            .WithTags(Tags.Users);
    }
}
