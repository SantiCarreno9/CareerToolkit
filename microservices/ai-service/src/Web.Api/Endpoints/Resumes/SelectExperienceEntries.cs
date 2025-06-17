using Application.Abstractions.Messaging;
using Application.Resumes.SelectExperienceEntries;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class SelectExperienceEntries: IEndpoint
{
    public sealed record Request(
    ResumeInstruction Instruction,
    List<ExperienceEntry> ExperienceEntries    
    );

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.AIResumesPath + "/select-experience-entries", async (
            [FromBody] Request request,
            ICommandHandler<SelectExperienceEntriesCommand, List<string>> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new SelectExperienceEntriesCommand(
                request.Instruction,
                request.ExperienceEntries             
                );
            Result<List<string>> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<string>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
