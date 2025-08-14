using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Users.Application.Users.GetByEmail;
using Module.Users.Application.Users.Shared;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;
using SharedKernel;

namespace Module.Users.Endpoints.Endpoints.Users;

internal sealed class GetByEmail : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.UsersBasePath, async (
            string email,
            [FromServices] IQueryHandler<GetUserByEmailQuery, UserResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByEmailQuery(email);

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()        
            .WithTags(Tags.Users);
    }
}
