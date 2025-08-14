using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Users.Application.Users.IsAuthenticated;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Users.Endpoints.Endpoints.Users;

internal sealed class IsAuthenticated : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet($"{EndpointsBase.UsersBasePath}/me", async (
            [FromServices] IQueryHandler<IsAuthenticatedQuery, IsAuthenticatedResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new IsAuthenticatedQuery();

            Result<IsAuthenticatedResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<IsAuthenticatedResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()        
            .WithTags(Tags.Users);
    }
}
