const API_URL = "http://localhost:5000/api";

export async function createBooking(bookingData) {

    const token = localStorage.getItem("token");

    console.log("Token:", token);


    const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(bookingData),
    });


    if (!response.ok) {
        throw new Error("Failed to create booking");
    }


    return response.json();
}