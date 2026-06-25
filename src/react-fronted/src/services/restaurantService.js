const API_PORT = process.env.REACT_APP_API_PORT || 3000;
const API_URL = `http://localhost:${API_PORT}/api/restaurants`;

export const getRestaurantById = async (id) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
    }

    return response.json();
};

export const getRestaurantProducts = async (id) => {
    const response = await fetch(`${API_URL}/${id}/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant products');
    }

    return response.json();
};