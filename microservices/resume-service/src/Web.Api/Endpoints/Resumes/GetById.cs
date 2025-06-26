using Application.Abstractions.Messaging;
using Application.Resumes.GetById;
using Application.Resumes.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ResumesPath + "/{id}", async (
            string id,
            IQueryHandler<GetResumeByIdQuery, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetResumeByIdQuery(id);

            Result<ResumeResponse> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<ResumeResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
