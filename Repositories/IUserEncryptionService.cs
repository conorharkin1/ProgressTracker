namespace ProgressTracker.Repositories
{
    public interface IUserEncryptionService
    {
        string Encrypt(string plaintext);
        string Decrypt(string encrypted);
    }
}