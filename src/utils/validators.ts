export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    // Example: Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const isNonEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

export const isLongEnough = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength;
}
