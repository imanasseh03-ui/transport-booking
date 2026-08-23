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


    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
    }

    return data;
}

export async function initializePayment(paymentData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/payment/initialize",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

