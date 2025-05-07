using Microsoft.AspNetCore.Identity;
using UserService.Application.DTOs.Requests;
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
        }

        public static async Task<IResult> RegisterUser(
            RegisterUserRequest request,
            IUserService userService
            )
        {
            var result = await userService.RegisterUserAsync(request);
            return Results.Ok(result);
        }

        public static async Task<IResult> Logout(            
            SignInManager<User> signInManager)
        {
            try
            {
                await signInManager.SignOutAsync();
                return Results.Ok("Successfully logged Out");
            }
            catch (Exception error)
            {
                return Results.Problem(error.Message);
            }
        }
    }
}
