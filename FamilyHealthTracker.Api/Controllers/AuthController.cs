using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Dtos.Auth;
using FamilyHealthTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IAuthService _authService;
    private readonly IOtpService _otpService;
    private readonly IEmailSender _emailSender;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        AppDbContext db,
        IAuthService authService,
        IOtpService otpService,
        IEmailSender emailSender,
        IJwtTokenService jwtTokenService)
    {
        _db = db;
        _authService = authService;
        _otpService = otpService;
        _emailSender = emailSender;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var user = await _authService.RegisterAsync(request.Email, request.Password, request.FullName, cancellationToken);
        return CreatedAtAction(nameof(Register), new { user.Id });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _authService.ValidateCredentialsAsync(request.Email, request.Password, request.InternetIdentityToken, cancellationToken);
        if (user is null)
        {
            return Unauthorized();
        }

        var otp = await _otpService.GenerateAndStoreAsync(user.Id, cancellationToken);
        await _emailSender.SendOtpAsync(user.Email, otp, cancellationToken);
        return Ok(new { message = "OTP sent." });
    }

    [EnableRateLimiting("otp")]
    [HttpPost("verify-otp")]
    public async Task<ActionResult<AuthResponse>> VerifyOtp(VerifyOtpRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _db.UserAccounts.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
        if (user is null)
        {
            return Unauthorized();
        }

        var valid = await _otpService.ValidateAsync(user.Id, request.Otp, cancellationToken);
        if (!valid)
        {
            return Unauthorized();
        }

        var (token, expiresAt) = _jwtTokenService.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAt));
    }
}