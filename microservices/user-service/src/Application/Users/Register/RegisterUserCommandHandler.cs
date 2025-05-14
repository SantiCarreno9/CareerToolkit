using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using Domain.Events;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Users.Register;

internal sealed class RegisterUserCommandHandler(IUserRepository userRepository)
    : ICommandHandler<RegisterUserCommand, string>
{
    public async Task<Result<string>> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        if (await userRepository.IsEmailRegistered(command.Email, cancellationToken))
        {
            return Result.Failure<string>(UserErrors.EmailNotUnique);
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = command.Email,
            FullName = command.FullName
        };

        user.Raise(new UserRegisteredDomainEvent(user.Id));

        await userRepository.RegisterUserAsync(user, command.Password, cancellationToken);

        return user.Id;
    }
}
