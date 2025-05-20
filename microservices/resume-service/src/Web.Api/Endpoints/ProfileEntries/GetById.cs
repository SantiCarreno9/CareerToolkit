using Application.Abstractions.Messaging;
using Application.ProfileEntries.GetById;
using Application.ProfileEntries.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

internal sealed class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesPath + "/{entryId}", async (
            string entryId,
            IQueryHandler<GetEntryByIdQuery, ProfileEntryResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetEntryByIdQuery(entryId);

            Result<ProfileEntryResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<ProfileEntryResponse>(StatusCodes.Status200OK)            
            .RequireAuthorization()
        //.HasPermission(Permissions.UsersAccess)
            .WithTags(Tags.ProfileEntries);
    }
}
