using Application.Abstractions.Messaging;
using Application.CoverLetters.GetById;
using Application.CoverLetters.Shared;
using Application.Resumes.GetById;
using Application.Resumes.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.CoverLetters;

internal sealed class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.CoverLettersPath + "/{id}", async (
            string id,
            IQueryHandler<GetCoverLetterByIdQuery, CoverLetterResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetCoverLetterByIdQuery(id);

            Result<CoverLetterResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<CoverLetterResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
