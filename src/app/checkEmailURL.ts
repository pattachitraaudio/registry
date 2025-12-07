export function checkEmailURL(email: string) {
    return `/checkEmail?email=${encodeURIComponent(email)}`;
}
