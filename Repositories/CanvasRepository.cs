
using System.Net.Http.Headers;
using ProgressTracker.Models;
using ProgressTracker.Models.CanvasModels;
using Task = System.Threading.Tasks.Task;

namespace ProgressTracker.Repositories
{
    public class CanvasRepository : ICanvasRepository
    {
        private readonly IUserRepository _userRepository;
        private readonly IHttpClientFactory _httpClientFactory;

        public CanvasRepository(IUserRepository userRepository, IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _userRepository = userRepository;
        }

        public async Task Sync(string userId)
        {
            // Firstly fetch the canvas api key associated to the user
            var decryptedCanvasApiKey = await _userRepository.GetCanvasApiKey();

            // Set up the http client using the decrypted key to make requests
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.BaseAddress = new Uri("https://canvas.qub.ac.uk/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", decryptedCanvasApiKey);

            if (await IsApiKeyValidAndWorking(decryptedCanvasApiKey, httpClient))
            {
                try
                {
                    // Fetch my favourited (current) courses
                    var courses = await httpClient.GetFromJsonAsync<List<Course>>("/api/v1/users/self/favorites/courses");

                    foreach (var course in courses)
                    {
                        var assignments = await httpClient.GetFromJsonAsync<List<Assignment>>($"/api/v1/courses/{course.id}/assignments");
                        var modules = await httpClient.GetFromJsonAsync<List<Module>>($"/api/v1/courses/{course.id}/modules?include[]=items");

                        var objectives = new List<Objective>();
                        if (assignments != null && assignments.Count > 0)
                        {
                            foreach (var assignment in assignments)
                            {
                                objectives.Add(new Objective
                                {
                                    Name = assignment.name,
                                    Hours = assignment.due_at.HasValue ? (int)(assignment.due_at - DateTime.Now).Value.TotalHours : 5,
                                    IsComplete = assignment.has_submitted_submissions
                                });
                            }
                        }

                        //TODO: Redo this for loop; A course has multiple assignments (Tasks) and Assignments have multiple objectives (Objectives).
                        // Assignments can be mapped to Tasks and Objectives are objectives.
                        // I want to integrate with HuggingFace to categorise the assignments and objectives but include Module objects as they are something assignment like.
                        // The LLM can then further categorise and decide what is a small medium and large task.
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

        public async Task<bool> IsApiKeyValidAndWorking(string key, HttpClient httpClient)
        {
            // Firstly fetch the canvas api key associated to the user
            if (string.IsNullOrEmpty(key))
            {
                return false;
            }

            // Make a test request to the profile endpoint to verify the key
            var profileResponse = await httpClient.GetAsync("/api/v1/users/self/profile");
            if (!profileResponse.IsSuccessStatusCode)
            {
                return false;
            }

            return true;
        }

    }
}