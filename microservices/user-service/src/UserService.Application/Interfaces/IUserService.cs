using UserService.Application.DTOs.Requests;
using UserService.Application.DTOs.Responses;

namespace UserService.Application.Interfaces
{
    public interface IUserService
    {
        public Task<PersonalDetailsResponse?> GetUserPersonalDetailsByIdAsync(string userId);
        public Task<PersonalDetailsResponse?> UpdateUserPersonalDetailsAsync(string userId, PersonalDetailsRequest personalDetailsRequest);

        public Task<bool> UserExistsAsync(string email);

        public Task<RegisterUserResponse?> RegisterUserAsync(RegisterUserRequest request);
    }
}
