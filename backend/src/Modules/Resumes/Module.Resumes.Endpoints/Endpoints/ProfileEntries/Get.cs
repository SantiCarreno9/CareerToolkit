using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.ProfileEntries.Get;
using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;
using SharedKernel.Endpoints.Extensions;

namespace Module.Resumes.Endpoints.Endpoints.ProfileEntries;

internal sealed class Get : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesBasePath, async (
            [FromServices] IQueryHandler<GetProfileEntriesQuery, List<ProfileEntryResponse>> handler,
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
