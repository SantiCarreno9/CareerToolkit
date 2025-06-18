using SharedKernel;

namespace Domain.Errors;

public static class UserErrors
{
    public static Error NotFound(string userId) => Error.NotFound(
    "Users.NotFound",
    $"The user with the Id = '{userId}' was not found");

    public static Error Unauthorized() => Error.Unathorized(
        "Users.Unauthorized",
        "You are not authorized to perform this action.");

    public static readonly Error NotFoundByEmail = Error.NotFound(
        "Users.NotFoundByEmail",
        "The user with the specified email was not found");

    public static readonly Error EmailNotUnique = Error.Conflict(
        "Users.EmailNotUnique",
        "The provided email is not unique");

    public static readonly Error RefreshTokenExpired = Error.Unathorized(
        "RefreshToken.Expired",
        "The token has already expired");
}
