import React, { useState, useRef, useEffect } from "react";
import { mockFetchRandomNumber } from '../api/mockAPI';
import './OTPStyles.css';

function OTPInput() {
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isOtpValid, setIsOtpValid] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = e.target.value;
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
    
            // Move to next input if current value is filled
            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pasteData = e.clipboardData.getData("text").slice(0, 4);
        if (/^\d{1,4}$/.test(pasteData)) {
            const newOtp = pasteData.split("");
            setOtp([...newOtp, ...new Array(4 - newOtp.length).fill("")]);
            inputRefs.current[pasteData.length - 1]?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "ArrowRight" && index < 3) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const response = await mockFetchRandomNumber();
            setRandomNumber(response[0]);
        } catch (error) {
            setError('Failed to fetch the random number');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (randomNumber !== null) {
            const otpValue = otp.join(""); // Join the array of OTP values into a single string
            setIsOtpValid(otpValue === randomNumber.toString());
        }
    }, [otp, randomNumber]);

    return (
        <div>
            <div className="otp-box">
                <h2>Te enviamos un SMS</h2>
                <p>Ingresá el código que te enviamos al +506 8888 8888</p>
                {error && <p>Error: {error}</p>}
                <div className="input-boxes">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            value={value}
                            maxLength={1}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                        />
                    ))}
                </div>

                <div className="button-box">
                <button
                    className={`send-button ${isOtpValid ? "valid" : ""}`}
                    disabled={!isOtpValid}
                    onClick={() => alert("OTP enviado!")}
                >
                    Send
                </button>
                </div>
            </div>
            <div className="cheat-number">
            <p>{loading ? loading && "Loading..." : "hey este es el numero: " + randomNumber }</p>
            </div>
        </div>
    );
}

export default OTPInput;
