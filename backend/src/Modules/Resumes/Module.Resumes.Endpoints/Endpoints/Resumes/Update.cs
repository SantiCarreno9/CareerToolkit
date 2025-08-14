using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.Resumes.Shared;
using Module.Resumes.Application.Resumes.Update;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.Resumes;

internal sealed class Update : IEndpoint
{
    public sealed record Request(
    string Name,
    string UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string? JobPosting,
    string Keywords);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.ResumesBasePath + "/{id}", async (
            string id,
            [FromBody] Request request,
            [FromServices] ICommandHandler<UpdateResumeCommand, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateResumeCommand
            (
                id,
                request.Name,
                request.UserInfo,
                request.ProfileEntries,
                request.Keywords,
                request.JobPosting,
                request.ResumeInfo
            );

            Result<ResumeResponse> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<ResumeResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
