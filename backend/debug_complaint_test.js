const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testComplaint() {
    try {
        const form = new FormData();
        form.append('title', 'Test Complaint');
        form.append('category', 'safety'); // Testing the new category
        form.append('description', 'This is a test complaint description that is long enough.');
        form.append('state', 'Test State');
        form.append('city', 'Test City');
        form.append('address', 'Test Address');
        form.append('pincode', '123456');
        form.append('contactPhone', '1234567890');
        form.append('contactEmail', 'test@example.com');

        // Make sure we are hitting the right port
        const response = await axios.post('http://localhost:5000/api/complaints', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Success:', response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Response:', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testComplaint();
