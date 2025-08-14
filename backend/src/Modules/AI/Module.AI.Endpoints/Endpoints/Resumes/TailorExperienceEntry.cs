using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Module.AI.Application.Resumes.TailorExperienceEntry;
using Module.AI.Domain.Entities;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;
using SharedKernel.Endpoints;
using SharedKernel.Endpoints.Extensions;
using SharedKernel.Endpoints.Infrastructure;

namespace Module.AI.Endpoints.Endpoints.Resumes;

internal sealed class TailorExperienceEntry : IEndpoint
{
    public sealed record Request(
    ResumeInstruction Instruction,
    ExperienceEntry ExperienceEntry    
    );

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.AIResumesPath+"/tailor-experience-entry", async (
            [FromBody] Request request,
            [FromServices] ICommandHandler<TailorExperienceEntryCommand, List<string>> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new TailorExperienceEntryCommand(
                request.Instruction,
                request.ExperienceEntry                
                );
            Result<List<string>> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<List<string>>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
