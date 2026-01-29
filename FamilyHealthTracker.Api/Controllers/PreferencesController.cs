using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Dtos.Preferences;
using FamilyHealthTracker.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/preferences")]
public class PreferencesController : ControllerBase
{
    private readonly AppDbContext _db;

    public PreferencesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<PreferencesDto>> Get(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var preference = await _db.UserPreferences.FirstOrDefaultAsync(x => x.UserAccountId == userId, cancellationToken);
        return preference is null ? NotFound() : Ok(new PreferencesDto(preference.UnitSystem));
    }

    [HttpPut]
    public async Task<ActionResult> Update(PreferencesDto request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var preference = await _db.UserPreferences.FirstOrDefaultAsync(x => x.UserAccountId == userId, cancellationToken);
        if (preference is null)
        {
            return NotFound();
        }

        preference.UnitSystem = request.UnitSystem;
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}