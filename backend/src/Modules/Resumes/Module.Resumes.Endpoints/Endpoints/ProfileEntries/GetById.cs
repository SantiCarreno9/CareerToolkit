using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.ProfileEntries.GetById;
using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.ProfileEntries;

internal sealed class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesBasePath + "/{entryId}", async (
            string entryId,
            [FromServices] IQueryHandler<GetEntryByIdQuery, ProfileEntryResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetEntryByIdQuery(entryId);

            Result<ProfileEntryResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<ProfileEntryResponse>(StatusCodes.Status200OK)            
            .RequireAuthorization()        
            .WithTags(Tags.ProfileEntries);
    }
}
