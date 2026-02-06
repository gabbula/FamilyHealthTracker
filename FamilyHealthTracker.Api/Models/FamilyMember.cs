using System.ComponentModel.DataAnnotations;

namespace FamilyHealthTracker.Api.Models;

public class FamilyMember
{
    public Guid Id { get; set; }

    public Guid UserAccountId { get; set; }
    public UserAccount? UserAccount { get; set; }

    [MaxLength(160)]
    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public Gender Gender { get; set; }

    [MaxLength(120)]
    public string Ethnicity { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<HealthMetric> Metrics { get; set; } = new List<HealthMetric>();
}