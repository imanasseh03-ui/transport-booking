const API_URL = import.meta.env.VITE_API_URL;

export async function getBookings() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/bookings`, {
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
        `${API_URL}/admin/bookings/${id}`,
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
        `${API_URL}/admin/trips`,
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

    const response = await fetch(`${API_URL}/admin/trips`, {
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
        `${API_URL}/admin/trips/${id}`,
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

    const response = await fetch(`${API_URL}/admin/routes`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}

export async function getBuses() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/buses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}

export async function updateTrip(id, tripData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/trips/${id}`,
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

    const response = await fetch(`${API_URL}/admin/users`, {
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

export async function getAdminBuses() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/buses`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data;
}

export async function createBus(busData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/buses`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(busData)
        }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data;
}
