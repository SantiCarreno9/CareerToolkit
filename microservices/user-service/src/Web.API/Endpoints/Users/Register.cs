using Application.Abstractions.Messaging;
using Application.Users.Register;
using Application.Users.Shared;
using SharedKernel;
using Web.Api.Extensions;
using Web.Api.Infrastructure;

namespace Web.Api.Endpoints.Users;

internal sealed class Register : IEndpoint
{
    public sealed record Request(string Email, string FullName, string Password);

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/users/register", async (
            Request request,
            ICommandHandler<RegisterUserCommand> handler,
            CancellationToken cancellationToken) =>
        {
            var command = new RegisterUserCommand(
                request.Email,
                request.FullName,
                request.Password);

            Result result = await handler.Handle(command, cancellationToken);

            return result.Match(Results.NoContent, CustomResults.Problem);
        })
            .Produces(StatusCodes.Status204NoContent)
            .WithTags(Tags.Users);
    }
}
