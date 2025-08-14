using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.AI.Application.Resumes.TailorSkills;
using Module.AI.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.AI.Endpoints.Endpoints.Resumes;

internal sealed class TailorSkills : IEndpoint
{
    public sealed record Request(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries,
    string? CurrentSkills
    );

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.AIResumesPath + "/tailor-skills", async (
            [FromBody] Request request,
            [FromServices] ICommandHandler<TailorSkillsCommand, List<string>> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new TailorSkillsCommand(
                request.Instruction,
                request.ExperienceEntries,
                request.CurrentSkills
                );
            Result<List<string>> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<string>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
