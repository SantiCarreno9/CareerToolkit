using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.DTOs.Requests;
using UserService.Application.DTOs.Responses;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/users").WithTags("User Service");

            group.MapPost("/register", RegisterUser);
            group.MapPost("/logout", Logout).RequireAuthorization();
            group.MapGet("/personaldetails", GetUserPersonalInfo).RequireAuthorization();
            group.MapPost("/personaldetails", UpdateUserPersonalInfo).RequireAuthorization();
        }

        public static async Task<Results<Ok<RegisterUserResponse>, ProblemHttpResult>> RegisterUser(
            RegisterUserRequest request,
            IUserService userService
            )
        {
            var result = await userService.RegisterUserAsync(request);
            return TypedResults.Ok(result);
        }

        public static async Task<Results<Ok<string>, ProblemHttpResult>> Logout(
            SignInManager<User> signInManager)
        {
            try
            {
                await signInManager.SignOutAsync();
                return TypedResults.Ok("Successfully logged Out");
            }
            catch (Exception error)
            {
                return TypedResults.Problem(error.Message);
            }
        }

        public static async Task<IResult> GetUserPersonalInfo(
            SignInManager<User> signInManager,
            IUserService userService)
        {
            var userId = signInManager.Context.User.Claims.First().Value;
            if (userId == null)
            {
                return Results.NotFound("User not found");
            }
            var result = await userService.GetUserPersonalDetailsByIdAsync(userId);
            return result != null
                ? Results.Ok(result)
                : Results.NotFound("User not found");
        }

        public static async Task<IResult> UpdateUserPersonalInfo(
            [FromBody] PersonalDetailsRequest personalDetailsRequest,
            SignInManager<User> signInManager,
            IUserService userService)
        {
            var userId = signInManager.Context.User.Claims.First().Value;
            if (userId == null)
            {
                return Results.NotFound("User not found");
            }
            var result = await userService.UpdateUserPersonalDetailsAsync(userId, personalDetailsRequest);
            return result != null
                ? Results.Ok(result)
                : Results.NotFound("User not found");
        }
    }
}
