using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.Abstractions;
using Module.Resumes.Application.Resumes.Get;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.Resumes;

internal sealed class Get : IEndpoint
{
    internal class Request
    {
        public string SearchTerm { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ResumesBasePath, async (
            [AsParameters] Request parameters,
            [FromServices] IQueryHandler<GetResumesQuery, PagedList<GetResumesResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetResumesQuery(parameters.SearchTerm, parameters.Page, parameters.PageSize);

            Result<PagedList<GetResumesResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<PagedList<GetResumesResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
