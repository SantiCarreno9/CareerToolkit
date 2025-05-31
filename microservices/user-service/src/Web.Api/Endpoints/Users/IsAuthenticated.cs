using Application.Abstractions.Messaging;
using Application.Users.IsAuthenticated;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class IsAuthenticated : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet($"{EndpointsBase.BasePath}/me", async (
            IQueryHandler<IsAuthenticatedQuery, IsAuthenticatedResponse> handler,
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
