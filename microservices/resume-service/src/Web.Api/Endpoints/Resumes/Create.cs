using Application.Abstractions.Messaging;
using Application.Resumes.Create;
using Application.Resumes.Shared;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class Create : IEndpoint
{
    public sealed record Request(
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string Keywords,
    string? JobPosting);

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.ResumesPath, async (
            [FromBody] Request request,
            ICommandHandler<CreateResumeCommand, ResumeResponse> handler,
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
            return Results.Created(EndpointsBase.ProfileEntriesPath, result.Value);
        })
            .Produces<ResumeResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
