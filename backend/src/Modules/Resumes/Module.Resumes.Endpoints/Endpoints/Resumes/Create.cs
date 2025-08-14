using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.Resumes.Create;
using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.Resumes;

internal sealed class Create : IEndpoint
{
    public sealed record Request(
    string Name,
    string UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting);

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.ResumesBasePath, async (
            [FromBody] Request request,
            [FromServices] ICommandHandler<CreateResumeCommand, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new CreateResumeCommand(
                request.Name,
                request.UserInfo,
                request.ProfileEntries,
                request.ResumeInfo,
                request.Keywords,
                request.JobPosting
                );
            Result<ResumeResponse> result = await handler.Handle(command, cancellationToken);

            if (result.IsFailure)
            {
                return CustomResults.Problem(result);
            }
            return Results.Created(EndpointsBase.ResumesBasePath, result.Value);
        })
            .Produces<ResumeResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
