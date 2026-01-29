namespace FamilyHealthTracker.Api.Models;

public class UserPreference
{
    public Guid Id { get; set; }

    public Guid UserAccountId { get; set; }
    public UserAccount? UserAccount { get; set; }

    public UnitSystem UnitSystem { get; set; } = UnitSystem.Metric;
}