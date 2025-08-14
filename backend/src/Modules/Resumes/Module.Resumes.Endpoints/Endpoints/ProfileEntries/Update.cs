using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.ProfileEntries.Update;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.ProfileEntries;

internal sealed class Update : IEndpoint
{
    public sealed record Request(
        string Title,
        string? Organization,
        string? Location,
        DateOnly StartDate,
        DateOnly? EndDate,
        bool IsCurrent,
        string? Description,
        ProfileEntryCategory Category);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.ProfileEntriesBasePath + "/{id}", async (
            string id,
            [FromBody] Request request,
            [FromServices] ICommandHandler<UpdateProfileEntryCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateProfileEntryCommand
            {
                Id = id,
                Title = request.Title,
                Organization = request.Organization,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsCurrent = request.IsCurrent,
                Description = request.Description,
                Category = request.Category
            };

            Result result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .RequireAuthorization()
            .WithTags(Tags.ProfileEntries);
    }
}
