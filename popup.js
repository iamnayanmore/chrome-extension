const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

btn.addEventListener("click", async () => {

  chrome.storage.sync.get("color", ({color}) => {
    console.log({color})
  });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript(
    {
      target: {
        tabId: tab.id,
      },
      function: pickColor,
    },
    async (injectionResults) => {
      if(injectionResults) {
        console.log("inside")
        const [data] = injectionResults;
        if (data.result) {
          const color = data.result.sRGBHex;
          colorGrid.style.backgroundColor = color;
          colorValue.innerHTML = color;
          try {
            await navigator.clipboard.writeText(color);
          } catch (error) {
            color.log(error);
          }
        }
      }
    }
  );
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (error) {
    console.log(error);
  }
}
