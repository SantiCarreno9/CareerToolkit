using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.Abstractions;
using Module.Resumes.Application.CoverLetters.Get;
using SharedKernel;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.CoverLetters;

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
        app.MapGet(EndpointsBase.CoverLettersBasePath, async (
            [AsParameters] Request parameters,
            [FromServices] IQueryHandler<GetCoverLettersQuery, PagedList<GetCoverLettersResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetCoverLettersQuery(parameters.SearchTerm, parameters.Page, parameters.PageSize);

            Result<PagedList<GetCoverLettersResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<PagedList<GetCoverLettersResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
