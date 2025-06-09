using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Application.Resumes.Update;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class Update : IEndpoint
{
    public sealed record Request(
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    List<string> Keywords);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.ResumesPath + "/{id}", async (
            [FromQuery] string id,
            [FromBody] Request request,
            ICommandHandler<UpdateResumeCommand, ResumeResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateResumeCommand
            (
                id,
                request.Name,
                request.UserInfo,
                request.ProfileEntries,
                request.Keywords,
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
