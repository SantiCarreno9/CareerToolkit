using System.ComponentModel.DataAnnotations;
using UserService.Domain.Exceptions;

namespace UserService.API.Middlewares
{
    // API/Middleware/ExceptionHandlingMiddleware.cs
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // continue the pipeline
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int statusCode;
            string message = exception.Message;

            switch (exception)
            {
                case ValidationException:
                    statusCode = StatusCodes.Status400BadRequest;
                    break;
                case ConflictException:
                    statusCode = StatusCodes.Status409Conflict;
                    break;                
                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    message = exception.Message?? "An unexpected error occurred.";                    
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new { message };

            return context.Response.WriteAsJsonAsync(response);
        }
    }

}
