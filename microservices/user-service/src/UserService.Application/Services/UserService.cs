using UserService.Application.DTOs.Requests;
using UserService.Application.DTOs.Responses;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Application.Services
{
    public class UserService(IUserRepository userRepository) : IUserService
    {
        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await userRepository.GetUserByIdAsync(userId);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await userRepository.GetUserByEmailAsync(email);
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            var user = await userRepository.GetUserByEmailAsync(email);
            return user != null;
        }

        public async Task<RegisterUserResponse?> RegisterUserAsync(RegisterUserRequest request)
        {
            return await userRepository.RegisterUserAsync(request);
        }

    }
}
