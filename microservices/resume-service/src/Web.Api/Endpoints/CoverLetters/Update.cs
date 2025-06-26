using Application.Abstractions.Messaging;
using Application.CoverLetters.Shared;
using Application.CoverLetters.Update;
using Application.Resumes.Shared;
using Application.Resumes.Update;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.CoverLetters;

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
        app.MapPut(EndpointsBase.CoverLettersPath + "/{id}", async (
            string id,
            [FromBody] Request request,
            ICommandHandler<UpdateCoverLetterCommand, CoverLetterResponse> handler,
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
