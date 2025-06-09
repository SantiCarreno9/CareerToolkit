using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Infrastructure;

internal sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {

        logger.LogError(exception, "Unhandled exception occurred");

        var errorResponse = new ProblemDetails
        {
            Detail = exception.Message,
            Title = "Internal Server Error",
            Type = exception.GetType().Name
        };
        switch (exception)
        {
            case BadHttpRequestException:
                errorResponse.Status = (int)HttpStatusCode.BadRequest;
                errorResponse.Title = exception.GetType().Name;                
                break;
            default:
                errorResponse.Status = (int)HttpStatusCode.InternalServerError;
                errorResponse.Title = "Internal Server Error";
                break;
        }
        httpContext.Response.StatusCode = errorResponse.Status.Value;
        await httpContext
            .Response
            .WriteAsJsonAsync(errorResponse, cancellationToken);
        return true;
    }
}
