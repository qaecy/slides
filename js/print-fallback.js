document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isPrintPDF = urlParams.get("print-pdf") !== null;

  //   If in print mode all print fallbacks should be shown instead of original content
  if (isPrintPDF) {
    // Get sections (not container sections that host sub-sections)
    const sections = Array.from(
      document.getElementsByTagName("section")
    ).filter((section) => !section.querySelector("section"));

    for (const section of sections) {
      const fallbacks = section.querySelectorAll(".print-fallback");
      if (fallbacks.length) {
        // Display the fallbacks
        fallbacks.forEach((element) => {
          element.style.display = "block";
        });
        // Hide the other content
        const nonFallbacks = section.querySelectorAll(":not(.print-fallback)");
        nonFallbacks.forEach((element) => {
          element.style.display = "none";
        });
      }
      if(fallbacks.length === 1){
        const el = fallbacks[0];
        if (el.tagName.toLowerCase() === "img") {
            el.parentElement.style.display = "block";
            el.parentElement.style.textAlign = "center";
            el.style.display = "inline-block";
            el.style.maxHeight = "600px";
            el.style.height = "80%";
            // el.setAttribute("height", "80%");
        }
        fallbacks[0]
      }
    }
  }

  // If not in print mode all print fallbacks should be hidden
  else {
    document.querySelectorAll(".print-fallback").forEach((element) => {
      element.style.display = "none";
    });
  }
});
