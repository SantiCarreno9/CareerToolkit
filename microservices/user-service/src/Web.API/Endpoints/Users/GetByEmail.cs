using Application.Abstractions.Messaging;
using Application.Users.GetByEmail;
using Application.Users.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class GetByEmail : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.BasePath, async (
            string email,
            IQueryHandler<GetUserByEmailQuery, UserResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByEmailQuery(email);

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
        //.HasPermission(Permissions.UsersAccess)
            .WithTags(Tags.Users);
    }
}
