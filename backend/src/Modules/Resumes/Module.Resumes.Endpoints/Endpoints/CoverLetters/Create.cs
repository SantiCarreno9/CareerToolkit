using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.Resumes.Application.CoverLetters.Create;
using Module.Resumes.Application.CoverLetters.Shared;
using Module.Resumes.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.Resumes.Endpoints.Endpoints.CoverLetters;

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
        app.MapPost(EndpointsBase.CoverLettersBasePath, async (
            [FromBody] Request request,
            [FromServices] ICommandHandler<CreateCoverLetterCommand, CoverLetterResponse> handler,
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
            return Results.Created(EndpointsBase.CoverLettersBasePath, result.Value);
        })
            .Produces<CoverLetterResponse>(StatusCodes.Status201Created)
            .RequireAuthorization()
            .WithTags(Tags.CoverLetters);
    }
}
