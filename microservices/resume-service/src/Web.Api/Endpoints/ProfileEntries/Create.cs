using Application.Abstractions.Messaging;
using Application.ProfileEntries.Create;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

internal sealed class Create : IEndpoint
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
        app.MapPost(EndpointsBase.ProfileEntriesPath, async (
            [FromBody]Request request,
            ICommandHandler<CreateProfileEntryCommand, string> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new CreateProfileEntryCommand
            {
                Title = request.Title,
                Organization = request.Organization,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsCurrent = request.IsCurrent,
                Description = request.Description,
                Category = request.Category
            };

            Result<string> result = await handler.Handle(command, cancellationToken);
            if (result.IsFailure)
            {
                return CustomResults.Problem(result);
            }
            return Results.Created(EndpointsBase.ProfileEntriesPath, result.Value);            
        })
            .Produces<string>(StatusCodes.Status201Created)
            .RequireAuthorization()        
            .WithTags(Tags.ProfileEntries);
    }
}
