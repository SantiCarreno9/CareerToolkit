using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.AI.Application.Resumes.SelectExperienceEntries;
using Module.AI.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.AI.Endpoints.Endpoints.Resumes;

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
            [FromServices] ICommandHandler<SelectExperienceEntriesCommand, List<string>> handler,
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
