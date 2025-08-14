using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.CoverLetters.GetById;
using Module.Resumes.Application.CoverLetters.Shared;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.CoverLetters;

internal sealed class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.CoverLettersBasePath + "/{id}", async (
            string id,
            [FromServices] IQueryHandler<GetCoverLetterByIdQuery, CoverLetterResponse> handler,
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
