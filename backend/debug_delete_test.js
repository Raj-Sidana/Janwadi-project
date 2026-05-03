require('dotenv').config();

(async () => {
  try {
    const authRes = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@1.jw', password: 'Admin123' }),
    });
    const auth = await authRes.json();
    console.log('auth status', authRes.status, auth.message || auth.error);
    if (!authRes.ok) return;

    const token = auth.token;
    const complaintsRes = await fetch('http://localhost:5000/api/admin/complaints', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const complaints = await complaintsRes.json();
    console.log('complaints status', complaintsRes.status);
    console.log('complaints count', complaints.complaints?.length);
    if (!complaints.complaints?.length) return;

    const id = complaints.complaints[0]._id;
    console.log('deleting', id);

    // First test if the route exists with OPTIONS or HEAD
    const optionsRes = await fetch(`http://localhost:5000/api/admin/complaints/${id}`, {
      method: 'OPTIONS',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('OPTIONS status', optionsRes.status);

    const deleteRes = await fetch(`http://localhost:5000/api/admin/complaints/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteText = await deleteRes.text();
    console.log('delete status', deleteRes.status);
    console.log('delete response body:', deleteText);
  } catch (err) {
    console.error(err);
  }
})();