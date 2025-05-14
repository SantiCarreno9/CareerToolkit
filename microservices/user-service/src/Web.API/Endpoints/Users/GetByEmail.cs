using Application.Abstractions.Messaging;
using Application.Users.GetById;
using Web.Api.Endpoints.Users;
using Web.Api.Endpoints;
using Application.Users.GetByEmail;
using SharedKernel;
using Web.Api.Infrastructure;
using Web.Api.Extensions;
using Application.Users.Shared;

namespace Web.Api.Endpoints.Users;

internal sealed class GetByEmail : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("api/users", async (
            string email,
            IQueryHandler<GetUserByEmailQuery, UserResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByEmailQuery(email);

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
        .HasPermission(Permissions.UsersAccess)
        .WithTags(Tags.Users);
    }
}