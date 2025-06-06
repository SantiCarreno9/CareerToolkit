using Application.Abstractions.Messaging;
using Application.Resumes.Get;
using Application.Resumes.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class Get : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(EndpointsBase.ResumesPath, async (
            IQueryHandler<GetResumesQuery, List<ResumeResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetResumesQuery();

            Result<List<ResumeResponse>> result = await handler.Handle(query, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<ResumeResponse>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.ProfileEntries);
    }
}
