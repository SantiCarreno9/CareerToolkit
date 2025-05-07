using Microsoft.AspNetCore.Identity;
using UserService.Application.DTOs.Requests;
using UserService.Application.DTOs.Responses;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Exceptions;
using UserService.Infrastructure.Data;

namespace UserService.Infrastructure.Repositories
{
    public class UserRepository(AppDbContext context, UserManager<User> userManager) : IUserRepository
    {
        //public async Task<User?> GetUserByIdAsync(string userId)
        //{
        //    return await context.Users.FindAsync(userId);
        //}
        public Task<User?> GetUserByEmailAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task<User?> GetUserByIdAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<RegisterUserResponse?> RegisterUserAsync(RegisterUserRequest request)
        {
            if (await userManager.FindByEmailAsync(request.Email) != null)
                throw new ConflictException("Email is already in use");

            var user = new User { UserName = request.Email, Email = request.Email, FullName = request.FullName };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                throw new Exception(result.Errors.First().Description);

            return new RegisterUserResponse(UserId: user.Id, Message: "User registered successfully");
        }
    }
}
