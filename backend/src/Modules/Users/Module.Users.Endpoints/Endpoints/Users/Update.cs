using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Users.Application.Users.UpdatePersonalInfo;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Users.Endpoints.Endpoints.Users;

internal sealed class Update : IEndpoint
{
    public sealed record Request(string FullName, string Address, string PhoneNumber, Dictionary<string,string> AdditionalContactInfo);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.UsersBasePath + "/{id}", async (
            string id,
            [FromBody]Request request,
            [FromServices] ICommandHandler<UpdatePersonalInfoCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdatePersonalInfoCommand(
                id,
                request.FullName,
                request.Address,
                request.PhoneNumber,
                request.AdditionalContactInfo
                );

            Result result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .RequireAuthorization()
            .WithTags(Tags.Users);
    }
}
