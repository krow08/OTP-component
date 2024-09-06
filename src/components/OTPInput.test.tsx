import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import OTPInput from "./OTPInput";
import { mockFetchRandomNumber } from '../api/mockAPI';

// Mock the API function
jest.mock('../api/mockAPI', () => ({
    mockFetchRandomNumber: jest.fn()
}));

describe("OTPInput Component", () => {
    test("renders OTP input fields", () => {
        render(<OTPInput />);
        const inputs = screen.getAllByRole("textbox");
        expect(inputs).toHaveLength(4); // There should be 4 OTP input fields
    });

    test("allows user to input values and move between fields", () => {
        render(<OTPInput />);
        const inputs = screen.getAllByRole("textbox");

        fireEvent.change(inputs[0], { target: { value: "1" } });
        fireEvent.change(inputs[1], { target: { value: "2" } });
        fireEvent.change(inputs[2], { target: { value: "3" } });
        fireEvent.change(inputs[3], { target: { value: "4" } });

        expect(inputs[0]).toHaveValue("1");
        expect(inputs[1]).toHaveValue("2");
        expect(inputs[2]).toHaveValue("3");
        expect(inputs[3]).toHaveValue("4");
    });

    test("enables the send button when OTP is valid", async () => {
        // Define the mocked random number
        const mockNumber = 1234;
        (mockFetchRandomNumber as jest.Mock).mockResolvedValue([mockNumber]);

        render(<OTPInput />);

        // Wait for the component to fetch the random number and update the state
        await waitFor(() => {
            // Ensure the fetch has been completed and randomNumber has been set
            expect(screen.getByText(/hey este es el numero: 1234/i)).toBeInTheDocument();
        });

        const sendButton = screen.getByRole("button", { name: /send/i });
        const inputs = screen.getAllByRole("textbox");

        // Initially, the button should be disabled
        expect(sendButton).toBeDisabled();

        // Enter OTP that matches the mocked random number
        fireEvent.change(inputs[0], { target: { value: "1" } });
        fireEvent.change(inputs[1], { target: { value: "2" } });
        fireEvent.change(inputs[2], { target: { value: "3" } });
        fireEvent.change(inputs[3], { target: { value: "4" } });

        // Wait for the button to be enabled
        await waitFor(() => {
            expect(sendButton).not.toBeDisabled(); // Button should be enabled now
        });
    });

    test("shows error if there is an error fetching the random number", async () => {
        // Simulate an error in the API call
        (mockFetchRandomNumber as jest.Mock).mockRejectedValue(new Error("API is down"));

        render(<OTPInput />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch the random number/i)).toBeInTheDocument();
        });
    });
});
