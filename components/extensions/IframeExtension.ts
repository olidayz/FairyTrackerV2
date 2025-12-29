import { Node, mergeAttributes } from '@tiptap/core';

export interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string; width?: string; height?: string; style?: string }) => ReturnType;
    };
  }
}

const Iframe = Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400',
      },
      frameborder: {
        default: '0',
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      style: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'iframe-embed' }, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const container = document.createElement('div');
      container.className = 'iframe-embed relative';
      container.style.cssText = 'position: relative; margin: 1rem 0;';

      const iframe = document.createElement('iframe');
      iframe.src = node.attrs.src || '';
      iframe.width = node.attrs.width || '100%';
      iframe.height = node.attrs.height || '400';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'border-radius: 8px; display: block;';

      if (editor.isEditable) {
        iframe.style.pointerEvents = 'none';
        
        const overlay = document.createElement('div');
        overlay.className = 'iframe-overlay';
        overlay.style.cssText = 'position: absolute; inset: 0; background: rgba(0,0,0,0.1); border: 2px dashed rgba(6, 182, 212, 0.5); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;';
        
        const label = document.createElement('span');
        label.textContent = `Embed: ${node.attrs.src}`;
        label.style.cssText = 'background: rgba(0,0,0,0.7); color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;';
        overlay.appendChild(label);
        
        container.appendChild(iframe);
        container.appendChild(overlay);
      } else {
        container.appendChild(iframe);
      }

      return {
        dom: container,
      };
    };
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default Iframe;
