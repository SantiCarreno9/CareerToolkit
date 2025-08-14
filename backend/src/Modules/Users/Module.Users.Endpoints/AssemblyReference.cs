using System.Reflection;

namespace Module.Users.Endpoints;

public static class AssemblyReference
{
    public static readonly Assembly UserModuleAssembly = Assembly.GetExecutingAssembly();
}
