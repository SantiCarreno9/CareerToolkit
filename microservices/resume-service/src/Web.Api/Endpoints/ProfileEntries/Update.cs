using Application.Abstractions.Messaging;
using Application.ProfileEntries.Update;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

internal sealed class Update : IEndpoint
{
    public sealed record Request(
        string Title,
        string? Organization,
        string? Location,
        DateOnly StartData,
        DateOnly? EndDate,
        bool IsCurrent,
        string? Description,
        ProfileEntryCategory Category);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.ProfileEntriesPath + "/{id}", async (
            string id,
            [FromBody] Request request,
            ICommandHandler<UpdateProfileEntryCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateProfileEntryCommand
            {
                Id = id,
                Title = request.Title,
                Organization = request.Organization,
                Location = request.Location,
                StartDate = request.StartData,
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
