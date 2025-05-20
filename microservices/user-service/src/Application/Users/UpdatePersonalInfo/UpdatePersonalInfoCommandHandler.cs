using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Errors;
using Domain.Events;
using Domain.Extensions;
using SharedKernel;

namespace Application.Users.UpdatePersonalInfo;
internal sealed class UpdatePersonalInfoCommandHandler(IUserRepository userRepository, IUserContext userContext) :
    ICommandHandler<UpdatePersonalInfoCommand>
{
    public async Task<Result> Handle(UpdatePersonalInfoCommand command, CancellationToken cancellationToken)
    {
        User? user = await userRepository.GetUserById(command.Id,cancellationToken);
        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound(command.Id));
        }

        if(command.Id != userContext.UserId)
        {
            return Result.Failure(UserErrors.Unauthorized());
        }

        User? updatedUser = await userRepository.UpdateUserInfo(new User
        {
            Id = user.Id,
            Email = user.Email,
            FullName = command.FullName,
            Address = command.Address,
            PhoneNumber = command.PhoneNumber,
            AdditionalContactInfo = command.AdditionalContactInfo
        },cancellationToken);

        if(updatedUser is null)
        {
            return Result.Failure(Error.Failure("500","Unexpected Error"));
        }
        user.Raise(new UserInfoUpdatedDomainEvent(updatedUser.Id));
        
        return Result.Success();
    }
}
