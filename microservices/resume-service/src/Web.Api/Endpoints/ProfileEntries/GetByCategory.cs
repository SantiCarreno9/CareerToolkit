using Application.Abstractions.Messaging;
using Application.ProfileEntries.GetByCategory;
using Application.ProfileEntries.Shared;
using Domain.Entities;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.ProfileEntries;

internal sealed class GetByCategory : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesPath+"/category/{category}", async (
            ProfileEntryCategory category,
            IQueryHandler<GetEntriesByCategoryQuery, List<ProfileEntryResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetEntriesByCategoryQuery(category);

            Result<List<ProfileEntryResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<ProfileEntryResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()        
            .WithTags(Tags.ProfileEntries);
    }
}
