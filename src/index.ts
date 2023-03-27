import jsQR from "jsqr";

const fileInput = document.querySelector<HTMLInputElement>("#file-input")!;

fileInput.addEventListener("change", handleFileInputChange);

document.addEventListener("paste", handlePasteEvent);

async function handleFileInputChange(e: Event): Promise<void> {
  const target = e.target as HTMLInputElement;
  if (target.files?.length === 0) {
    return;
  }
  const image = target.files[0];
  await scan(image);
}

async function handlePasteEvent(event: ClipboardEvent): Promise<void> {
  const items = event.clipboardData?.items ?? [];
  for (const item of items) {
    if (item.kind === "file") {
      const blob = item.getAsFile();
      await scan(blob!);
    }
  }
}

async function scan(image: File): Promise<void> {
  const imgElement = document.querySelector<HTMLImageElement>("#img-result") ?? document.createElement("img");
  imgElement.setAttribute("id", "img-result");

  const fileReader = new FileReader();

  fileReader.onload = () => {
    imgElement.src = fileReader.result as string;
    const container = document.querySelector("#result-wrapper")!;
    container.appendChild(imgElement);

    imgElement.onload = () => {
      const pixels = imageToPixels(imgElement);
      const text = jsQR(pixels, imgElement.width, imgElement.height);
      const resultElement = document.querySelector("#result-text")!;
      resultElement.textContent = text?.data;
    };
  };
  fileReader.readAsDataURL(image);
}

function imageToPixels(image: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const pixels = new Uint8ClampedArray(imageData.data);

  return pixels;
}
