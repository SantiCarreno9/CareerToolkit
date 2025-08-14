using Microsoft.EntityFrameworkCore;
using Module.Users.Application.Abstractions.Authentication;
using Module.Users.Application.Abstractions.Data;
using Module.Users.Application.Users.Login;
using Module.Users.Domain.Entities;
using Module.Users.Domain.Errors;
using SharedKernel;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.LoginUserWithRefreshToken;
internal sealed class LoginUserWithRefreshTokenCommandHandler(
    IApplicationDbContext context,
    ITokenProvider tokenProvider) : ICommandHandler<LoginUserWithRefreshTokenCommand, LoginUserResponse>
{
    public async Task<Result<LoginUserResponse>> Handle(LoginUserWithRefreshTokenCommand command, CancellationToken cancellationToken)
    {
        RefreshToken? refreshToken = await context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == command.RefreshToken, cancellationToken);

        if (refreshToken == null || refreshToken.ExpiresOnUtc < DateTime.UtcNow)
        {
            return Result.Failure<LoginUserResponse>(UserErrors.RefreshTokenExpired);
        }

        string accessToken = tokenProvider.Create(refreshToken.User);

        refreshToken.Token = tokenProvider.GenerateRefreshToken();
        refreshToken.ExpiresOnUtc = DateTime.UtcNow.AddDays(7);

        await context.SaveChangesAsync(cancellationToken);

        return new LoginUserResponse(accessToken, refreshToken.Token);
    }
}
