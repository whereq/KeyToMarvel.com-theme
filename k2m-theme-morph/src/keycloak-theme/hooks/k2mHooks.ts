import { useState } from "react";

export function usePasswordVisibility() {
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordRevealed((prev) => !prev);
    };

    return {
        isPasswordRevealed,
        togglePasswordVisibility,
    };
}