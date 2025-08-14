using Module.Users.Domain.Entities;

namespace Module.Users.Application.Abstractions.Authentication;

public interface ITokenProvider
{
    string Create(User user);
    string GenerateRefreshToken();
}
