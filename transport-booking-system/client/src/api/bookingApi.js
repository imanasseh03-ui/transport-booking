const API_URL = "http://localhost:5000/api";

export async function createBooking(bookingData) {
    const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        hearders: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
        throw new Error("Failed to create booking");
    }

    return response.json();
}