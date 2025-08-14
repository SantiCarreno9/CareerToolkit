using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.Resumes.Duplicate;
using Module.Resumes.Application.Resumes.Shared;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.Resumes;

public sealed class Duplicate : IEndpoint
{
    public sealed record Request(
    string Id,
    string Name,
    string Keywords,
    string? JobPosting);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.ResumesBasePath + "/duplicate", async (
            [FromBody] Request request,
            [FromServices] ICommandHandler<DuplicateResumeCommand, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new DuplicateResumeCommand(request.Id, request.Name, request.Keywords, request.JobPosting);
            Result<ResumeResponse> result = await handler.Handle(command, cancellationToken);
            if (result.IsFailure)
            {
                return CustomResults.Problem(result);
            }
            return Results.Created(EndpointsBase.ResumesBasePath + "/duplicate", result.Value);
        })
            .Produces<ResumeResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
