using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Errors;
using Microsoft.EntityFrameworkCore;
using SharedKernel;

namespace Application.Users.IsAuthenticated;
internal sealed class IsAuthenticatedQueryHandler(IApplicationDbContext context, IUserContext userContext)
    : IQueryHandler<IsAuthenticatedQuery, IsAuthenticatedResponse>
{
    public async Task<Result<IsAuthenticatedResponse>> Handle(IsAuthenticatedQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userContext.UserId))
        {
            return Result.Failure<IsAuthenticatedResponse>(UserErrors.Unauthorized());
        }

        IsAuthenticatedResponse? response = await context.Users
            .Where(u => u.Id == userContext.UserId)
            .Select(u => new IsAuthenticatedResponse
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .SingleAsync(cancellationToken);

        if (response is null)
        {
            return Result.Failure<IsAuthenticatedResponse>(UserErrors.NotFound(userContext.UserId));
        }

        return response;
    }
}
