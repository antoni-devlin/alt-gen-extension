const altTextContainer = document.getElementById("generated-alt-text");
const image_input = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-container");
const uploadForm = document.getElementById("upload-form");
const testButton = document.getElementById("test-button");
const ENDPOINT = "https://api.openai.com/v1/responses";

const systemPrompt = `You are an AI that generates alt text for images. Your task is to create a descriptive alt text for the given image. The alt text should be concise and accurately describe the content of the image.`;

image_input.addEventListener("change", (event) => {
  if (event.target.files && event.target.files.length > 0) {
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
  }
});

uploadForm.addEventListener("submit", async (event) => {
  // Prevent the default form submission
  event.preventDefault();
  console.log("Form submitted");
  await fetchCompletions(apiKey);
  altTextContainer.style.display = "block";
});

async function convertImageToBase64(imageElement) {
  try {
    // Fetch the image and get as blob
    const res = await fetch(imageElement.src);
    const blob = await res.blob();

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return dataUrl;
  } catch (error) {
    console.log(error("Error converting image to base64:", error));
  }
}

async function fetchCompletions(apiKey) {
  try {
    console.log("Sending request to OpenAI");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const base64Image = await convertImageToBase64(imagePreview);
    const body = {
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: systemPrompt },
            {
              type: "input_image",
              image_url: base64Image,
            },
          ],
        },
      ],
    };

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const altText = data["output"][0]["content"][0]["text"];
    console.log(altText);
    altTextContainer.getElementsByTagName("p")[0].innerText = altText;
    return response;
  } catch (error) {
    console.log("There was an error fetching completions", error);
  }
}
