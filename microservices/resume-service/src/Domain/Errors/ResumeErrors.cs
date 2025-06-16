using SharedKernel;

namespace Domain.Errors;
public static class ResumeErrors
{
    public static Error NotFound(string resumeId) => Error.NotFound(
        "Resume.NotFound",
        $"The resume with the Id = '{resumeId}' was not found");

    public static Error Unauthorized() => Error.Unathorized(
        "Resume.Unauthorized",
        "You are not authorized to perform this action.");
}
