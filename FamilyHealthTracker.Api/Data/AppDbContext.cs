using FamilyHealthTracker.Api.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Data;

public class AppDbContext : DbContext
{
    private readonly IDataProtector _protector;

    public AppDbContext(DbContextOptions<AppDbContext> options, IDataProtectionProvider provider)
        : base(options)
    {
        _protector = provider.CreateProtector("FamilyHealthTracker.HealthMetrics.v1");
    }

    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();
    public DbSet<FamilyMember> FamilyMembers => Set<FamilyMember>();
    public DbSet<HealthMetric> HealthMetrics => Set<HealthMetric>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var decimalConverter = new EncryptedDecimalConverter(_protector);

        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Email).IsRequired();
            entity.HasOne(x => x.Preference)
                .WithOne(x => x.UserAccount)
                .HasForeignKey<UserPreference>(x => x.UserAccountId);
        });

        modelBuilder.Entity<FamilyMember>(entity =>
        {
            entity.Property(x => x.Name).IsRequired();
            entity.Property(x => x.Ethnicity).HasDefaultValue(string.Empty);
            entity.HasOne(x => x.UserAccount)
                .WithMany(x => x.FamilyMembers)
                .HasForeignKey(x => x.UserAccountId);
        });

        modelBuilder.Entity<HealthMetric>(entity =>
        {
            entity.Property(x => x.WeightKg).HasConversion(decimalConverter).HasColumnType("nvarchar(512)");
            entity.Property(x => x.HeightM).HasConversion(decimalConverter).HasColumnType("nvarchar(512)");
            entity.Property(x => x.Bmi).HasConversion(decimalConverter).HasColumnType("nvarchar(512)");
            entity.Property(x => x.GlucoseMgDl).HasConversion(decimalConverter).HasColumnType("nvarchar(512)");
            entity.HasOne(x => x.FamilyMember)
                .WithMany(x => x.Metrics)
                .HasForeignKey(x => x.FamilyMemberId);
        });
    }
}