using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Users.Application.Abstractions.Authentication;
using Module.Users.Application.Users.GetById;
using Module.Users.Application.Users.Shared;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Users.Endpoints.Endpoints.Users;

internal sealed class GetMyInfo : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet($"{EndpointsBase.UsersBasePath}/myinfo", async (
            [FromServices] IQueryHandler<GetUserByIdQuery, UserResponse> handler,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByIdQuery(userContext.UserId);

            Result<UserResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()        
            .WithTags(Tags.Users);
    }
}
