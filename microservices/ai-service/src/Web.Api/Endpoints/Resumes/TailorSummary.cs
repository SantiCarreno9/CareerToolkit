using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class TailorSummary : IEndpoint
{
    public sealed record Request(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSummary
    );

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.AIResumesPath + "/tailor-summary", async (
            [FromBody] Request request,
            ICommandHandler<TailorSummaryCommand, List<string>> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new TailorSummaryCommand(
                request.Instruction,
                request.ExperienceEntries,
                request.CurrentSummary
                );
            Result<List<string>> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<string>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
