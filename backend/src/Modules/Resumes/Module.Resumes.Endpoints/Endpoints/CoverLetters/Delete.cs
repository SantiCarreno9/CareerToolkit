using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.CoverLetters.Delete;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.CoverLetters;

public sealed class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(EndpointsBase.CoverLettersBasePath + "/{id}", async (
            string id,
            [FromServices] ICommandHandler<DeleteCoverLetterCommand> handler,
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
