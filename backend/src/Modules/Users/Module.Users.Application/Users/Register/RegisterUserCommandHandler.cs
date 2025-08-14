using Microsoft.EntityFrameworkCore;
using Module.Users.Application.Abstractions.Authentication;
using Module.Users.Application.Abstractions.Data;
using Module.Users.Domain.Entities;
using Module.Users.Domain.Errors;
using Module.Users.Domain.Events;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.Register;

internal sealed class RegisterUserCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher)
    : ICommandHandler<RegisterUserCommand>
{
    public async Task<Result> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        if (await context.Users.AnyAsync(u => u.Email == command.Email, cancellationToken))
        {
            return Result.Failure(UserErrors.EmailNotUnique);
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = command.Email,
            FullName = command.FullName,
            PasswordHash = passwordHasher.Hash(command.Password),
        };

        user.Raise(new UserRegisteredDomainEvent(user.Id));

        context.Users.Add(user);

        await context.SaveChangesAsync(cancellationToken);        

        return Result.Success();
    }
}
