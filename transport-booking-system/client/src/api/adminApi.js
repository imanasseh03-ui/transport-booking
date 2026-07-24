const API_URL = "http://localhost:5000/api";

export async function getBookings() {
    const response = await fetch(
        `${API_URL}/bookings`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
}

export async function updateBookingStatus(id, status) {
    const response = await fetch(
        `${API_URL}/bookings/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update booking");
    }

    return response.json();
}