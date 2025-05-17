using Application.Abstractions.Messaging;
using Application.Users.GetById;
using Web.Api.Endpoints.Users;
using Web.Api.Endpoints;
using Application.Users.GetByEmail;
using SharedKernel;
using Web.Api.Infrastructure;
using Web.Api.Extensions;
using Application.Users.Shared;
using Application.Users.GetMyInfo;

namespace Web.Api.Endpoints.Users;

internal sealed class GetMyInfo : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("api/users/me", async (            
            IQueryHandler<GetMyInfoQuery, UserResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetMyInfoQuery();

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
        //.HasPermission(Permissions.UsersAccess)
            .WithTags(Tags.Users);
    }
}
