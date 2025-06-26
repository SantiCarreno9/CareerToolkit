using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.CoverLetters.Get;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.CoverLetters;

internal sealed class Get : IEndpoint
{
    internal class Request {
        public string SearchTerm { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.CoverLettersPath, async(
            [AsParameters] Request parameters,            
            IQueryHandler<GetCoverLettersQuery, PagedList<GetCoverLettersResponse>> handler,
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
