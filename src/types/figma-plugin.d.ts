declare module '@figma/plugin-typings' {
  global {
    const figma: {
      createFrame(): FrameNode;
      createText(): TextNode;
      currentPage: PageNode;
      ui: {
        postMessage(msg: any): void;
        onmessage: ((event: { data: { pluginMessage: any } }) => void) | null;
      };
      closePlugin(): void;
      showUI(html: string, options?: { width?: number; height?: number }): void;
    };
  }

  export interface FrameNode {
    name: string;
    layoutMode: string;
    primaryAxisSizingMode: string;
    counterAxisSizingMode: string;
    fills: Paint[];
    resize(width: number, height: number): void;
    appendChild(child: SceneNode): void;
  }

  export interface TextNode {
    name: string;
    characters: string;
    fontSize: number;
    fills: Paint[];
  }
}