using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.ProfileEntries.Create;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.ProfileEntries;

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
        app.MapPost(EndpointsBase.ProfileEntriesBasePath, async (
            [FromBody]Request request,
            [FromServices] ICommandHandler<CreateProfileEntryCommand, string> handler,
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
            return Results.Created(EndpointsBase.ProfileEntriesBasePath, result.Value);            
        })
            .Produces<string>(StatusCodes.Status201Created)
            .RequireAuthorization()        
            .WithTags(Tags.ProfileEntries);
    }
}
