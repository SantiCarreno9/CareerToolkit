using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.ProfileEntries.GetByCategory;
using Module.Resumes.Application.ProfileEntries.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;
using SharedKernel;

namespace Module.Resumes.Endpoints.Endpoints.ProfileEntries;

internal sealed class GetByCategory : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ProfileEntriesBasePath + "/category/{category}", async (
            ProfileEntryCategory category,
            [FromServices] IQueryHandler<GetEntriesByCategoryQuery, List<ProfileEntryResponse>> handler,
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
