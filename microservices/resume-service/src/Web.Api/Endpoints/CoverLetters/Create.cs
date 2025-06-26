using Application.Abstractions.Messaging;
using Application.CoverLetters.Create;
using Application.CoverLetters.Shared;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.CoverLetters;

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
        app.MapPost(EndpointsBase.CoverLettersPath, async (
            [FromBody] Request request,
            ICommandHandler<CreateCoverLetterCommand, CoverLetterResponse> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new CreateCoverLetterCommand(
                request.Name,
                request.UserInfo,
                request.ProfileEntries,
                request.ResumeInfo,
                request.Keywords,
                request.JobPosting
                );
            Result<CoverLetterResponse> result = await handler.Handle(command, cancellationToken);

            if (result.IsFailure)
            {
                return CustomResults.Problem(result);
            }
            return Results.Created(EndpointsBase.ProfileEntriesPath, result.Value);
        })
            .Produces<CoverLetterResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
