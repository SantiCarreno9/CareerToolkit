using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.CoverLetters.Shared;
using Module.Resumes.Application.CoverLetters.Update;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.CoverLetters;

internal sealed class Update : IEndpoint
{
    public sealed record Request(
    string Name,
    UserInfo UserInfo,
    List<ProfileEntry> ProfileEntries,
    string ResumeInfo,
    string? JobPosting,
    string Keywords);
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(EndpointsBase.CoverLettersBasePath + "/{id}", async (
            string id,
            [FromBody] Request request,
            [FromServices] ICommandHandler<UpdateCoverLetterCommand, CoverLetterResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateCoverLetterCommand
            (
                id,
                request.Name,
                request.UserInfo,
                request.ProfileEntries,
                request.Keywords,
                request.JobPosting,
                request.ResumeInfo
            );

            Result<CoverLetterResponse> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<CoverLetterResponse>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
