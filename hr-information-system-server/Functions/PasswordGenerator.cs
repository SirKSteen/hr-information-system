using Org.BouncyCastle.Security;

namespace hr_information_system_server.Functions
{
    public class PasswordGenerator
    {
        public string Run()
        {
            int length = 7;
            var random = new SecureRandom();
            byte[] bytes = new byte[length];
            random.NextBytes(bytes);
            return Convert.ToBase64String(bytes)[..length];
        }
    }
}
