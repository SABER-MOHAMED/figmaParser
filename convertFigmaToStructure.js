function convertFigmaToStructure(figmaElement) {
    // Helper function to generate a path (you may need to adjust this based on your specific needs)
    function generatePath(element) {
      // This is a placeholder. You'll need to implement the logic to generate the correct path
      return "pages.treelink.sections.profile.items." + element.name.toLowerCase();
    }
  
    // Helper function to determine size based on fontSize
    function determineSize(fontSize) {
      if (fontSize <= 16) return "small";
      if (fontSize <= 24) return "medium";
      return "large";
    }
  
    // Helper function to determine variant based on name
    function determineVariant(name) {
      if (name.startsWith("H1")) return "h1";
      if (name.startsWith("H2")) return "h2";
      // Add more conditions as needed
      return "p";
    }
  
    return {
      path: generatePath(figmaElement),
      size: determineSize(figmaElement.fontSize),
      variant: determineVariant(figmaElement.name),
      options: {
        hasAiPrompt: true,  // You might want to determine this dynamically
        hasAnimation: false,  // You might want to determine this dynamically
        hasStyle: true,  // You might want to determine this dynamically
      },
      type: figmaElement.type,
      title: figmaElement.name,
      value: figmaElement.textData ? figmaElement.textData.characters : "",
      key: figmaElement.name.toLowerCase(),
      order: 1,  // You might want to determine this dynamically
    };
  }
  
  // Example usage:
  const figmaJson = {
    guid: { sessionID: 7, localID: 296 },
    phase: "CREATED",
    type: "TEXT",
    name: "H1",
    fontSize: 39,
    textAlignVertical: "TOP",
    lineHeight: { value: 85, units: "PIXELS" },
    fontName: { family: "Montserrat", style: "Bold", postscript: "MontserratRoman-Bold" },
    textData: {
      characters: "Recently Aired",
      lines: [
        { lineType: "PLAIN", styleId: 0, indentationLevel: 0, sourceDirectionality: "AUTO", listStartOffset: 0, isFirstLineOfList: false }
      ]
    }
  };
  
  const result = convertFigmaToStructure(figmaJson);
  console.log(JSON.stringify(result, null, 2));


  