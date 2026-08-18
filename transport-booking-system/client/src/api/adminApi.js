export async function getBookings() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function updateBookingStatus(id, status) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}


export const getTrips = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/admin/trips",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.json();
};

export async function createTrip(tripData) {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/trips", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function deleteTrip(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:5000/api/admin/trips/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function getRoutes() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/routes", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}

export async function getBuses() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/buses", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}

export async function updateTrip(id, tripData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:5000/api/admin/trips/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(tripData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function getUsers() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}