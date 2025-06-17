using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Gemini;
internal class BaseGeminiService
{
    private readonly string baseURL;
    private readonly HttpClient httpClient;
    private readonly ILogger<BaseGeminiService> logger;

    public BaseGeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<BaseGeminiService> logger)
    {
        string geminiEndpoint = configuration["Gemini:Endpoint"];
        string apiKey = configuration["Gemini:ApiKey"];
        baseURL = geminiEndpoint + apiKey;
        this.httpClient = httpClient;
        this.logger = logger;
    }

    //protected async Task<T?> BaseRequest<T>(Task<HttpResponseMessage> request)
    //{
    //    try
    //    {
    //        HttpResponseMessage response = await request;
    //        if (response.IsSuccessStatusCode)
    //        {
    //            if (response.StatusCode != HttpStatusCode.OK)
    //            {
    //                return default;
    //            }

    //            AiResponse aiResponse = await response.Content.ReadFromJsonAsync<AiResponse>();
    //            return await aiResponse.Candidates[0].Content.Parts[0].Text;
    //        }
    //        else
    //        {
    //            string message = await response.Content.ReadAsStringAsync();
    //            logger.Error(message);
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        logger.Error(ex, "");
    //    }
    //    return default;
    //}

    protected async Task<T> BaseRequest<T>(Task<HttpResponseMessage> request)
    {
        try
        {                        
            HttpResponseMessage response = await request;
            if (response.IsSuccessStatusCode)
            {                
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return default;
                }
                logger.LogInformation("Request Response:{Response}", await response.Content.ReadAsStringAsync());
                AiResponse aiResponse = await response.Content.ReadFromJsonAsync<AiResponse>();
                object content = aiResponse.Candidates[0].Content.Parts[0].Text;

                if (typeof(T) == typeof(string))
                {
                    return (T)content;
                }
                string contentStr = content.ToString();
                if (string.IsNullOrEmpty(contentStr))
                {
                    return default;
                }
                return JsonSerializer.Deserialize<T>(contentStr);
            }
            else
            {
                string message = await response.Content.ReadAsStringAsync();
                logger.LogError(message);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex,"Post request response:");
        }
        return default;
    }

    protected async Task<T> Post<T>(AiRequest request)
    {
        logger.LogInformation("Post request: {Request}",JsonSerializer.Serialize(request));
        return await BaseRequest<T>(httpClient.PostAsJsonAsync(baseURL, request));
    }

    protected async Task<string> Post(string prompt, string? instruction)
    {
        AiRequest request = instruction == null ? AiRequest.CreateRequest(prompt) : AiRequest.CreateRequest(prompt, instruction);
        return await BaseRequest<string>(httpClient.PostAsJsonAsync(baseURL, request));
    }

    //protected async Task<List<string>> Post(string prompt, string? instruction)
    //{
    //    AiRequest request = instruction == null ? AiRequest.CreateRequest(prompt) : AiRequest.CreateRequest(prompt, instruction);
    //    request.GenerationConfig = new AiSOResponseContainer
    //    {
    //        ResponseSchema = new AiSOArray
    //        {
    //            Items = new AiSOResponseSchema
    //            {
    //                Type = "STRING"
    //            }
    //        }
    //    };

    //    return await BaseRequest<List<string>>(httpClient.PostAsJsonAsync(baseURL, request));
    //}

    //protected async Task<T?> Post<T>(string prompt)
    //{
    //    var request = new AiRequest
    //    {
    //        Contents = new List<AiPartContainer>
    //        {
    //            new AiPartContainer
    //            {
    //                Parts = new List<AiPart>
    //                {
    //                    new AiPart
    //                    {
    //                        Text = prompt
    //                    }
    //                }
    //            }
    //        }
    //    };
    //    return await BaseRequest<T>(httpClient.PostAsJsonAsync(baseURL, request));
    //}

    //protected async Task<T?> Post<T>(string prompt, string instruction)
    //{
    //    var request = new AiRequest
    //    {
    //        SystemInstruction = new AiPartContainer
    //        {
    //            Parts = new List<AiPart>
    //            {
    //                new AiPart
    //                {
    //                    Text = instruction
    //                }
    //            }
    //        },
    //        Contents = new List<AiPartContainer>
    //        {
    //            new AiPartContainer
    //            {
    //                Parts = new List<AiPart>
    //                {
    //                    new AiPart
    //                    {
    //                        Text = prompt
    //                    }
    //                }
    //            }
    //        }
    //    };
    //    return await BaseRequest<T>(httpClient.PostAsJsonAsync(baseURL, request));
    //}

}
