using Application.Abstractions.Messaging;
using Application.Resumes.TailorExperienceEntry;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

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
            ICommandHandler<TailorExperienceEntryCommand, List<string>> handler,
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
