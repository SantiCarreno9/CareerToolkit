
using Application.Abstractions.Messaging;
using Application.Resumes.Duplicate;
using Application.Resumes.Shared;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

public sealed class Duplicate : IEndpoint
{
    public sealed record Request(
    string Id,
    string Name,
    string Keywords,
    string? JobPosting);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.ResumesPath + "/duplicate", async (
            [FromBody] Request request,
            ICommandHandler<DuplicateResumeCommand, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new DuplicateResumeCommand(request.Id, request.Name, request.Keywords, request.JobPosting);
            Result<ResumeResponse> result = await handler.Handle(command, cancellationToken);
            if (result.IsFailure)
            {
                return CustomResults.Problem(result);
            }
            return Results.Created(EndpointsBase.ProfileEntriesPath + "/duplicate", result.Value);
        })
            .Produces<ResumeResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
