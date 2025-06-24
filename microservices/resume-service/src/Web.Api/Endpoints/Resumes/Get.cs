using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Resumes.Get;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class Get : IEndpoint
{
    internal class Request {
        public string SearchTerm { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ResumesPath, async(
            [AsParameters] Request parameters,            
            IQueryHandler<GetResumesQuery, PagedList<GetResumesResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetResumesQuery(parameters.SearchTerm, parameters.Page, parameters.PageSize);

            Result<PagedList<GetResumesResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<PagedList<GetResumesResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.ProfileEntries);
    }
}
