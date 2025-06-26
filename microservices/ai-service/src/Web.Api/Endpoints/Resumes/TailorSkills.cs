using Application.Abstractions.Messaging;
using Application.Resumes.TailorSkills;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

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
            ICommandHandler<TailorSkillsCommand, List<string>> handler,
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
