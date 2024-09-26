namespace hr_information_system_server.Functions
{
    public class CleanString
    {
        public static string Run(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input; // Return as is if input is null or empty
            }

            // Replace ':' and '/' with '_'
            return input.Replace(':', '_').Replace('/', '_');
        }
    }
}
