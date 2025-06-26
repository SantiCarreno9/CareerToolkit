
using Application.Abstractions.Messaging;
using Application.CoverLetters.Delete;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.CoverLetters;

public sealed class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(EndpointsBase.CoverLettersPath + "/{id}", async (
            string id,
            ICommandHandler<DeleteCoverLetterCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new DeleteCoverLetterCommand(id);
            Result result = await handler.Handle(command, cancellationToken);
            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
