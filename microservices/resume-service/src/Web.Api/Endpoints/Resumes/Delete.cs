
using Application.Abstractions.Messaging;
using Application.ProfileEntries.Delete;
using Application.Resumes.Delete;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

public sealed class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(EndpointsBase.ResumesPath + "/{id}", async (
            string id,
            ICommandHandler<DeleteResumeCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new DeleteResumeCommand(id);
            Result result = await handler.Handle(command, cancellationToken);
            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
