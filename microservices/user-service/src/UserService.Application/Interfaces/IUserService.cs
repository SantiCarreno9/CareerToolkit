using UserService.Application.DTOs.Requests;
using UserService.Application.DTOs.Responses;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces
{
    public interface IUserService
    {
        public Task<User?> GetUserByIdAsync(string userId);

        public Task<User?> GetUserByEmailAsync(string email);

        public Task<bool> UserExistsAsync(string email);

        public Task<RegisterUserResponse?> RegisterUserAsync(RegisterUserRequest request);        
    }
}
