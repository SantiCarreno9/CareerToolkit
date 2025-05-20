using Application.Abstractions.Data;
using Domain.Entities;
using Domain.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Data;

namespace Infrastructure.Users;
public sealed class UserRepository(ApplicationDbContext context, UserManager<UserDb> userManager) : IUserRepository
{
    public async Task<User?> GetUserById(string id, CancellationToken cancellationToken)
    {
        return await context.Users
            .Where(u => u.Id == id)
            .Select(u => new User
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email!,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                AdditionalContactInfo = u.AdditionalContactInfo.ConvertToDictionary()
            })
            .AsNoTracking()
            .SingleOrDefaultAsync(cancellationToken);
    }
    public async Task<User?> GetUserByEmail(string email, CancellationToken cancellationToken)
    {
        return await context.Users
            .Where(u => u.Email == email)
            .Select(u => new User
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email!,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                AdditionalContactInfo = u.AdditionalContactInfo.ConvertToDictionary()
            })
            .AsNoTracking()
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> IsEmailRegistered(string email, CancellationToken cancellationToken)
    {
        return await context.Users
            .AnyAsync(u => u.Email == email,cancellationToken);
    }

    public async Task RegisterUserAsync(User user, string password, CancellationToken cancellationToken)
    {        
        var userdb = new UserDb { UserName = user.Email, Email = user.Email, FullName = user.FullName };

        await userManager.CreateAsync(userdb, password);        
    }

    public async Task<User?> UpdateUserInfo(User user, CancellationToken cancellationToken)
    {
        UserDb? userdb = await context.Users
            .Where(u => u.Id == user.Id)                        
            .SingleOrDefaultAsync(cancellationToken);
        if (userdb is null)
        {
            return null;
        }
        userdb.FullName = user.FullName;
        userdb.Address = user.Address;
        userdb.PhoneNumber = user.PhoneNumber;
        userdb.AdditionalContactInfo = user.AdditionalContactInfo.ConvertToJson();

        await context.SaveChangesAsync(cancellationToken);

        return new User
        {
            Id = userdb.Id,
            FullName = userdb.FullName,
            Email = userdb.Email!,
            Address = userdb.Address,
            PhoneNumber = userdb.PhoneNumber,
            AdditionalContactInfo = userdb.AdditionalContactInfo.ConvertToDictionary()
        };
    }
}
