using Application.Abstractions.Messaging;
using Application.Users.UpdatePersonalInfo;
using SharedKernel;
using Web.Api.Endpoints;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class Update : IEndpoint
{
    public sealed record Request(string FullName, string Address, string PhoneNumber, Dictionary<string,string> AdditionalContactInfo);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.BasePath + "/{id}", async (
            string id,
            Request request,
            ICommandHandler<UpdatePersonalInfoCommand> handler,
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
