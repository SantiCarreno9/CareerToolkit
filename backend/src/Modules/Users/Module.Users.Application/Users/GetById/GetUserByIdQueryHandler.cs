using Microsoft.EntityFrameworkCore;
using Module.Users.Application.Abstractions.Authentication;
using Module.Users.Application.Abstractions.Data;
using Module.Users.Application.Users.Shared;
using Module.Users.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.GetById;

internal sealed class GetUserByIdQueryHandler(IApplicationDbContext context, IUserContext userContext)
    : IQueryHandler<GetUserByIdQuery, UserResponse>
{
    public async Task<Result<UserResponse>> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        if (query.UserId != userContext.UserId)
        {
            return Result.Failure<UserResponse>(UserErrors.Unauthorized());
        }

        UserResponse? user = await context.Users
            .Where(u => u.Id == query.UserId)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                FullName = u.FullName,
                Address = u.Address ?? string.Empty,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber ?? string.Empty,
                AdditionalContactInfo = u.AdditionalContactInfo ?? new Dictionary<string, string>()
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return Result.Failure<UserResponse>(UserErrors.NotFound(query.UserId));
        }

        return user;
    }
}
