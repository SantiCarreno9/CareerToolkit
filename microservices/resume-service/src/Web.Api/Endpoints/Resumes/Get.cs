using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Resumes.Get;
using Application.Resumes.Shared;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class Get : IEndpoint
{    
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ResumesPath, async(
            int Page,
            int PageSize,     
            IQueryHandler<GetResumesQuery, PagedList<ResumeResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetResumesQuery(Page, PageSize);

            Result<PagedList<ResumeResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<PagedList<ResumeResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.ProfileEntries);
    }
}
