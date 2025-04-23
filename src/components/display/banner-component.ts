export function processBannerComponent(
  node: {
    tagName: string;
    attributes: Record<string, string>;
    childNodes: any[];
    text?: string;
  }, 
  settings: {
    preserveQuasarColors: boolean;
  }
): import('@figma/plugin-typings').FrameNode {
  const bannerFrame = figma.createFrame();
  bannerFrame.name = "q-banner";
  
  bannerFrame.layoutMode = "HORIZONTAL";
  bannerFrame.primaryAxisSizingMode = "AUTO";
  bannerFrame.counterAxisSizingMode = "AUTO";
  
  bannerFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  return bannerFrame;
}