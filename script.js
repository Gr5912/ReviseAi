document.getElementById('submit-prompt').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const fileInput = document.getElementById('file-upload');
    const responseOutput = document.getElementById('response-output');
    const file = fileInput.files[0];

    if (!prompt && !file) {
        responseOutput.innerHTML = '<p>Please enter a prompt or upload a file.</p>';
        return;
    }

    responseOutput.innerHTML = '<p>Loading...</p>';

    const formData = new FormData();
    if (prompt) {
        formData.append('prompt', prompt);
    }
    if (file) {
        formData.append('file', file);
    }

    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            responseOutput.innerHTML = `<p>Error: ${errorData.error}</p>`;
            return;
        }

        const data = await response.json();
        const markdownText = data.response;
        const html = marked.parse(markdownText);

        responseOutput.innerHTML = html;

        // Tell MathJax to process the new content
        if (window.MathJax) {
            MathJax.typesetPromise([responseOutput])
                .catch(function (err) {
                    console.log(err.message);
                });
        } else {
            console.log("MathJax not loaded");
        }

    } catch (error) {
        responseOutput.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});