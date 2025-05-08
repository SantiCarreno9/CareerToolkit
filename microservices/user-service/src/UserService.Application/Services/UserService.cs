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

        public async Task<PersonalDetailsResponse?> GetUserPersonalDetailsByIdAsync(string userId)
        {
            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return null;
            return new PersonalDetailsResponse(
                user.Id,
                user.FullName ?? string.Empty,
                user.Email ?? string.Empty,
                user.PhoneNumber ?? string.Empty,
                user.Address ?? string.Empty,
                user.AdditionalContactInfo ?? string.Empty
            );
        }

        public async Task<PersonalDetailsResponse?> UpdateUserPersonalDetailsAsync(string userId, PersonalDetailsRequest personalDetailsRequest)
        {
            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return null;
            user.FullName = personalDetailsRequest.FullName;
            user.PhoneNumber = personalDetailsRequest.PhoneNumber;
            user.Address = personalDetailsRequest.Address;
            user.AdditionalContactInfo = personalDetailsRequest.AdditionalContactInfo;

            var result = await userRepository.UpdateUserAsync(user);
            if (result == null)
                return null;
            return new PersonalDetailsResponse(
                user.Id,
                user.FullName ?? string.Empty,
                user.Email ?? string.Empty,
                user.PhoneNumber ?? string.Empty,
                user.Address ?? string.Empty,
                user.AdditionalContactInfo ?? string.Empty
            );
        }
    }
}
