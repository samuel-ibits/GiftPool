'use client';
import { useState } from 'react';

const NewsletterPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Successfully subscribed!');
            } else {
                setMessage(data.error || 'Failed to subscribe.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Subscribe to our Newsletter</h1>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <button onClick={handleSubscribe} disabled={loading || !email}>
                {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default NewsletterPage;