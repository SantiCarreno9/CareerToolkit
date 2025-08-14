using Microsoft.EntityFrameworkCore;
using Module.Users.Application.Abstractions.Authentication;
using Module.Users.Application.Abstractions.Data;
using Module.Users.Domain.Entities;
using Module.Users.Domain.Errors;
using Module.Users.Domain.Events;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.UpdatePersonalInfo;
internal sealed class UpdatePersonalInfoCommandHandler(IApplicationDbContext context, IUserContext userContext) :
    ICommandHandler<UpdatePersonalInfoCommand>
{
    public async Task<Result> Handle(UpdatePersonalInfoCommand command, CancellationToken cancellationToken)
    {
        if (command.Id != userContext.UserId)
        {
            return Result.Failure(UserErrors.Unauthorized());
        }

        User? user = await context.Users
            .Where(u=>u.Id==command.Id)
            .SingleOrDefaultAsync(cancellationToken);
        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound(command.Id));
        }        

        user.Address = command.Address;
        user.FullName = command.FullName;
        user.PhoneNumber = command.PhoneNumber;
        user.AdditionalContactInfo = command.AdditionalContactInfo;

        await context.SaveChangesAsync(cancellationToken);
        
        user.Raise(new UserInfoUpdatedDomainEvent(user.Id));
        
        return Result.Success();
    }
}
