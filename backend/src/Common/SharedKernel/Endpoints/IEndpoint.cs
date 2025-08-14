using Microsoft.AspNetCore.Routing;

namespace SharedKernel.Endpoints;

public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
