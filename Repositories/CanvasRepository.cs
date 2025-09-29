
using System.ClientModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using NuGet.Protocol;
using OpenAI;
using OpenAI.Chat;
using ProgressTracker.Models;
using ProgressTracker.Models.CanvasModels;
using Task = System.Threading.Tasks.Task;
using TaskModel = ProgressTracker.Models.Task;

namespace ProgressTracker.Repositories
{
    public class CanvasRepository : ICanvasRepository
    {
        private readonly IUserRepository _userRepository;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ITaskRepository _taskRepository;

        public CanvasRepository(IUserRepository userRepository, IHttpClientFactory httpClientFactory, ITaskRepository taskRepository)
        {
            _httpClientFactory = httpClientFactory;
            _userRepository = userRepository;
            _taskRepository = taskRepository;
        }

        private string credential = Environment.GetEnvironmentVariable("GITHUB_TOKEN") ?? throw new Exception("API Key not found in environment variables");
        private string model = "openai/gpt-5-mini";
        private Uri endpoint = new Uri("https://models.github.ai/inference");

        public async Task Sync(string userId)
        {
            // Firstly fetch the canvas api key associated to the user and ensure it's not null
            var decryptedCanvasApiKey = await _userRepository.GetCanvasApiKey() ?? throw new Exception("Canvas API Key not found");
            var canvasHttpClient = _httpClientFactory.CreateClient();
            // Set up the http client using the decrypted key to make requests
            canvasHttpClient.BaseAddress = new Uri("https://canvas.qub.ac.uk/");
            canvasHttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", decryptedCanvasApiKey);

            // SET UP OPENAI CALL
            var openAIOptions = new OpenAIClientOptions()
            {
                Endpoint = endpoint
            };

            var client = new ChatClient(model, new ApiKeyCredential(credential), openAIOptions);

            if (await IsApiKeyValidAndWorking(decryptedCanvasApiKey, canvasHttpClient))
            {
                try
                {
                    List<TaskModel> tasks = new List<TaskModel>();
                    // Fetch my favourited (current) courses
                    var courses = await canvasHttpClient.GetFromJsonAsync<List<Course>>("/api/v1/users/self/favorites/courses") ?? throw new Exception("You do not have any favourited courses");

                    foreach (var course in courses)
                    {
                        var assignments = await canvasHttpClient.GetFromJsonAsync<List<Assignment>>($"/api/v1/courses/{course.id}/assignments");
                        // var modules = await canvasHttpClient.GetFromJsonAsync<List<Module>>($"/api/v1/courses/{course.id}/modules?include[]=items");

                        // // Filter modules to only include ones that I'm interested in.
                        // modules = modules != null ? modules.Where(m => m.items != null && m.items.Where(i => i.type == "Assignment" || i.type == "Quiz" || i.title.Contains("Practical")).Any()).ToList() : new List<Module>();

                        foreach (var assignment in assignments)
                        {
                            var cleanedDescription = CleanHtml(assignment.description);
                            if (cleanedDescription.Length > 1000)
                            {
                                cleanedDescription = cleanedDescription.Substring(0, 1000);
                            }
                            assignment.description = cleanedDescription;

                            string modelInstructions = getModelInstructions();

                            List<ChatMessage> messages = new List<ChatMessage>()
                            {
                                new SystemChatMessage(modelInstructions),
                                new UserChatMessage($"Please convert the following into Tasks and Objectives, Assignment Name: {assignment.name} Assignment Description: {assignment.description}"),
                            };

                            var response = await client.CompleteChatAsync(messages, new ChatCompletionOptions()
                            {

                            });
                            var chatResponse = response.Value.Content.Last().Text;

                            var generatedTasks = JsonConvert.DeserializeObject<List<TaskModel>>(chatResponse);
                            tasks.AddRange(generatedTasks);
                        }
                    }

                    // Now we have all the tasks, we need to upsert them into the database
                    foreach (var task in tasks)
                    {
                        await _taskRepository.AddTask(task, userId);
                    }
                        
                }
                catch (HttpRequestException ex)
                {
                    // For network errors
                    throw new Exception($"Network error while contacting Canvas: {ex.Message}");
                }
                catch (Exception ex)
                {
                    throw new Exception($"Unexpected error: {ex.Message}");
                }
            }
            else
            {
                throw new Exception("The provided Canvas API key is invalid or not working.");
            }
        }

        public async Task<bool> IsApiKeyValidAndWorking(string key, HttpClient canvasHttpClient)
        {
            // Firstly fetch the canvas api key associated to the user
            if (string.IsNullOrEmpty(key))
            {
                return false;
            }

            // Make a test request to the profile endpoint to verify the key
            var profileResponse = await canvasHttpClient.GetAsync("/api/v1/users/self/profile");
            if (!profileResponse.IsSuccessStatusCode)
            {
                return false;
            }

            return true;
        }

        private static string CleanHtml(string html)
        {
            if (string.IsNullOrEmpty(html)) return "";
            string noTags = Regex.Replace(html, "<.*?>", "");
            return System.Net.WebUtility.HtmlDecode(noTags).Trim();
        }

        private static string getModelInstructions()
        {
            return $@"
                        You are an assistant that converts course assignment data into Task and Objective objects for a dashboard productivity app.
                        Rules:
                        - Create one Task per Assignment.
                        - TaskType is determined by workload:
                        - SMALL = 1 objective
                        - MEDIUM = 2–3 objectives
                        - LARGE = 4+ objectives
                        - Each Task must contain Objectives with Name and Hours estimates.
                        - Return only valid JSON array of Tasks, with the following schema:
                        [
                            Name: string,
                            DueDate: yyyy-MM-dd,
                            TaskType: Small|Medium|Large,
                            UserId: string,
                            Objectives: [
                                Name: string,
                                Hours: int,
                                IsComplete: false
                            ]
                        ]
                        - Use the following criteria to estimate Hours:
                            - SMALL: 1-2 hours
                            - MEDIUM: 3-6 hours
                            - LARGE: 7+ hours
                        - Use Assignment name and description to create meaningful Objective names.
                        Return only valid JSON.
                    ";
        }
    }
}