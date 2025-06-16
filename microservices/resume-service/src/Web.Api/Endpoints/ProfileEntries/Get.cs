using Application.Abstractions.Messaging;
using Application.ProfileEntries.Get;
using Application.ProfileEntries.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

internal sealed class Get : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesPath, async (
            IQueryHandler<GetProfileEntriesQuery, List<ProfileEntryResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetProfileEntriesQuery();

            Result<List<ProfileEntryResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<ProfileEntryResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()       
            .WithTags(Tags.ProfileEntries);
    }
}
