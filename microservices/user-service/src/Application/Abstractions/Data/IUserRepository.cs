using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;

public interface IUserRepository
{
    Task<bool> IsEmailRegistered(string email, CancellationToken cancellationToken);
    Task RegisterUserAsync(User user, string password, CancellationToken cancellationToken);
    Task<User?> GetUserById(string id, CancellationToken cancellationToken);
    Task<User?> GetUserByEmail(string email, CancellationToken cancellationToken);
    Task<User?> UpdateUserInfo(User user,CancellationToken cancellationToken);
}
