export async function sendPostMessage(url: string, message: string) {
    const data = {
        content: message,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error sending message: ${response.statusText}`);
        }
        return 'Message sent successfully'
    } catch (error) {
        console.error('Error sending message:', error);
        throw error; // re-throw the error
    }
}