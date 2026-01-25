// Debug script to test Gemini API
// Add this temporarily to your AddWord component to debug

// Test if environment variable is loaded
console.log('=== DEBUG INFO ===');
console.log('VITE_GEMINI_API_KEY exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
console.log('API Key length:', import.meta.env.VITE_GEMINI_API_KEY?.length || 0);
console.log('First 10 chars:', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10));
console.log('==================');

// Test API call directly
async function testGeminiAPI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ No API key found!');
    return;
  }

  console.log('Testing Gemini API...');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "API is working!" in one sentence.'
            }]
          }]
        })
      }
    );

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.error) {
      console.error('❌ API Error:', data.error);
    } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('✅ API is working! Response:', data.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testGeminiAPI();
