using SharedKernel;

namespace Domain.Errors;

public static class AIErrors
{
    public static Error LimitReached() => Error.Problem(
    "AI.LimitReached",
    $"You have reached the limit of requests per day");

    public static Error Unauthorized() => Error.Unathorized(
        "ProfileEntry.Unauthorized",
        "You are not authorized to perform this action.");

}
