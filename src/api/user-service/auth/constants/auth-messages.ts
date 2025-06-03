export const AUTH_MESSAGES = {
    // Registration
    REGISTER_SUCCESS: 'Your registration is complete. You can now log in.',

    // Login
    LOGIN_NOT_FOUND: 'A user with the entered email address was not found. Please check your email address or register.',
    LOGIN_UNAUTHORIZED_ROLE: 'You are not authorized to perform this operation with the requested role.',
    LOGIN_INCORRECT_PASSWORD: 'The password you entered is incorrect. Please check your password and try again.',
    LOGIN_GENERIC_ERROR: 'Something went wrong. Please try again.',

    // Refresh
    REFRESH_TOKEN_MISSING: 'The information required to refresh your session was not found. Please log in again.',
    REFRESH_USER_NOT_FOUND: 'Your user account could not be verified. Please log in again.',
    REFRESH_SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    REFRESH_SESSION_INVALID: 'Your session could not be verified. Please log in again.',

    // Logout
    LOGOUT_SUCCESS: 'You have successfully logged out.',

    // Validation
    USERNAME_ALREADY_IN_USE: 'This username is already in use. Please choose another username.',
    EMAIL_ALREADY_REGISTERED: 'This email address is already registered. Please use a different email address.',
}