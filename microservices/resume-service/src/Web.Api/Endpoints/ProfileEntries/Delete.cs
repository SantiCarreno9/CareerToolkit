
using Application.Abstractions.Messaging;
using Application.ProfileEntries.Delete;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

public sealed class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(EndpointsBase.ProfileEntriesPath + "/{id}", async (
            string id,
            ICommandHandler<DeleteProfileEntryCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new DeleteProfileEntryCommand(id);
            Result result = await handler.Handle(command, cancellationToken);
            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .RequireAuthorization()
            .WithTags(Tags.ProfileEntries);
    }
}
