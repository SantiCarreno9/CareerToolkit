using Application.Abstractions.Messaging;
using Application.ProfileEntries.Create;
using Domain.Entities;
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
        DateOnly StartData,
        DateOnly? EndDate,
        bool IsCurrent,
        string? Description,
        ProfileEntryCategory Category);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.ProfileEntriesPath, async (
            Request request,
            ICommandHandler<CreateProfileEntryCommand, string> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new CreateProfileEntryCommand
            {
                Title = request.Title,
                Organization = request.Organization,
                Location = request.Location,
                StartDate = request.StartData,
                EndDate = request.EndDate,
                IsCurrent = request.IsCurrent,
                Description = request.Description,
                Category = request.Category
            };

            Result<string> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Created, CustomResults.Problem);
        })
            .Produces<string>(StatusCodes.Status201Created)
            .RequireAuthorization()
        //.HasPermission(Permissions.UsersAccess)
            .WithTags(Tags.ProfileEntries);
    }
}
