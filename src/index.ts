import {
  BarcodeFormat,
  DecodeHintType,
  BrowserMultiFormatReader,
} from "@zxing/library";

const fileInput = document.querySelector("#file-input");

fileInput.addEventListener("change", async (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  if (target.files.length == 0) {
    return;
  }
  const image = target.files[0];
  await scan(image);
});
document.addEventListener("paste", async (event: ClipboardEvent) => {
  const items = event.clipboardData.items;
  for (let index in items) {
    const item = items[index];
    if (item.kind === "file") {
      const blob = item.getAsFile();
      await scan(blob);
    }
  }
});

async function scan(image: File) {
  const fileReader = new FileReader();

  const imgElement: HTMLImageElement =
    document.querySelector("#img-result") || document.createElement("img");
  imgElement.setAttribute("id", "img-result");

  fileReader.onload = async (ev) => {
    imgElement.src = ev.target.result.toString();
    const container = document.querySelector("#result-wrapper");
    container.appendChild(imgElement);
    const resultElement = document.querySelector("#result-text");
    const text = await readQR(imgElement);
    resultElement.textContent = text;
  };
  fileReader.readAsDataURL(image);
}

async function readQR(img: HTMLImageElement): Promise<string> {
  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const reader = new BrowserMultiFormatReader(hints);
  console.log(img.src);

  return (await reader.decodeFromImage(img)).getText();
}
