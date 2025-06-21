using Application.Abstractions.Messaging;
using Application.Resumes.TailorSection;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Resumes;

internal sealed class TailorSection : IEndpoint
{
    public sealed record Request(
    ResumeInstruction Instruction,
    string SectionContent
    );

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(EndpointsBase.AIResumesPath + "/tailor-section", async (
            [FromBody] Request request,
            ICommandHandler<TailorSectionCommand, string> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new TailorSectionCommand(
                request.Instruction,
                request.SectionContent                
                );
            Result<string> result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.Ok, CustomResults.Problem);
        })
            .Produces<string>(StatusCodes.Status200OK)
            .RequireAuthorization()
            .WithTags(Tags.Resumes);
    }
}
