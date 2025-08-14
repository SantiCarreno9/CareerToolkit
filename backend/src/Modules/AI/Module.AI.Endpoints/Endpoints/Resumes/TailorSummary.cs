using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.AI.Application.Resumes.TailorSummary;
using Module.AI.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.AI.Endpoints.Endpoints.Resumes;

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
            [FromServices] ICommandHandler<TailorSummaryCommand, string> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new TailorSummaryCommand(
                request.Instruction,
                request.ExperienceEntries,
                request.CurrentSummary
                );
            Result<string> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<string>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
