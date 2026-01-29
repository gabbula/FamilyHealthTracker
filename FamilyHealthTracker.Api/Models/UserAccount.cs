using System.ComponentModel.DataAnnotations;

namespace FamilyHealthTracker.Api.Models;

public class UserAccount
{
    public Guid Id { get; set; }

    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(512)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? FullName { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public UserPreference? Preference { get; set; }

    public ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
}