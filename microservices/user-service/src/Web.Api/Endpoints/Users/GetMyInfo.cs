using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Application.Users.GetById;
using Application.Users.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class GetMyInfo : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet($"{EndpointsBase.BasePath}/myinfo", async (            
            IQueryHandler<GetUserByIdQuery, UserResponse> handler,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByIdQuery(userContext.UserId);

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
        //.HasPermission(Permissions.UsersAccess)
            .WithTags(Tags.Users);
    }
}
