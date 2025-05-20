using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Users.GetMyInfo;
using Application.Users.Shared;
using Domain.Entities;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Users.GetById;

internal sealed class GetMyInfoQueryHandler(IUserRepository userRepository, IUserContext userContext)
    : IQueryHandler<GetMyInfoQuery, UserResponse>
{
    public async Task<Result<UserResponse>> Handle(GetMyInfoQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userContext.UserId))
        {
            return Result.Failure<UserResponse>(UserErrors.Unauthorized());
        }

        User? user = await userRepository.GetUserById(userContext.UserId, cancellationToken);
        if (user is null)
        {
            return Result.Failure<UserResponse>(UserErrors.NotFound(userContext.UserId));
        }

        var userResponse = new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Address = user.Address ?? string.Empty,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            AdditionalContactInfo = user.AdditionalContactInfo
        };

        return userResponse;
    }
}
